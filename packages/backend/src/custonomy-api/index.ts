import fs from "fs";
import path from "path";
import { httpErrorHandler } from "../utils/helpers";
import { Request, Response } from "express";
import sha256 from "sha256";
import Web3 from "web3";

import OrderModel from "../models/OrderModel";
import Model from "../models/Model";

import { CONTRACT_ABI, CONTRACT, INFURA_LINK } from "../utils/constants";

// imports for custonomy
import { Custonomy } from "./src";
import { Object } from "./src/utils/typedef";
import { generateECPrivateKey, ecSign, getECPublicKey } from "./src/utils/util";
import {
  API_KEY,
  API_SECRET,
  DEFAULT_ENDPOINT,
  TENANT,
  GAS_ENDPOINT,
  EC_KEY,
} from "../config/custonomy";

export const mintNFT = async (req: Request, res: Response) => {
  const trx = await Model.lock();

  let tx;
  try {
    tx = await OrderModel.getByTxID(req.body.id, trx);
  } catch (error) {
    Model.rollback(trx, error);
  }

  console.log("Old Transaction Data:", tx);

  if (tx.nft_minted) {
    console.log("NFT associated with the tx has already been minted");
    return httpErrorHandler(res, 401, "NFT has already been minted");
  } else {
    // Initialize Custonomy
    const custonomy = new Custonomy(
      API_KEY,
      API_SECRET,
      DEFAULT_ENDPOINT,
      TENANT
    );

    let ecPrivateKey: string;
    let userId: string = "";
    let address: string = "";
    let transactionId: string = "";

    let pendingTransaction: Object = {};
    let transactionOutcome: string = "";
    let txnHash: string = "";

    if (!process.env.MINTER_ADDRESS) {
      console.log("No minter address has been specified");
      return httpErrorHandler(res, 401, "An error has occured");
    }

    address = process.env.MINTER_ADDRESS;
    console.log("Selected Minter Address:", address);

    // Load recipient request
    const userAddress = req.body.address;
    const asset = req.body.asset;
    const abi = CONTRACT_ABI;
    const contractAddress = CONTRACT[asset] as any;

    // Form Transaction
    const mintTxn = {
      type: 2,
      chain: "ETH",
      subchain: "MATIC",
      asset: "MATIC",
      fromAddress: address,
      txnFee: 1.466666,
      gasLimit: 0,
      maxPriorityFeePerGas: 1.466666,
      maxFeePerGas: 1.466666,
      data: "0x",
      txnOuts: [{ amt: "0", to: contractAddress }],
    };

    let gasStationUrl = GAS_ENDPOINT; // CHAIN_ID == "80001" ? TESTNET_GAS : MAINNET_GAS;
    // Retrieve live gas price
    await fetch(gasStationUrl)
      .then((response) => response.json())
      .then((data) => {
        const stdFees = data.standard;
        mintTxn.txnFee = parseFloat(stdFees.maxFee.toFixed(6));
        mintTxn.maxPriorityFeePerGas = parseFloat(
          stdFees.maxPriorityFee.toFixed(6)
        );
        mintTxn.maxFeePerGas = parseFloat(stdFees.maxFee.toFixed(6));
      });

    const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_LINK));
    const contract = new web3.eth.Contract(abi as any, contractAddress);
    let func = contract.methods["mint"](userAddress, 1);
    mintTxn.data = func.encodeABI();

    const gasLimit = await web3.eth.getGasPrice();
    mintTxn.gasLimit = 1000000; // manually set gas limit

    // Load EC key
    ecPrivateKey = EC_KEY;

    try {
      let userInfo = await custonomy.getInfo();
      if (userInfo == null) throw "Unable to retrieve user info";
      userId = userInfo.id;
    } catch (ex) {
      console.log({ ex });
      return httpErrorHandler(res, 401, "An error has occured");
    }

    try {
      if (ecPrivateKey.length === 0 || userId.length === 0) {
        console.error("Missing EC key! Run 'yarn custonomy:register'");
        throw "Missing key";
      }
    } catch (ex) {
      console.log({ ex });
      return httpErrorHandler(res, 401, "An error has occured");
    }

    // Submit Transaction to Custonomy
    await custonomy
      .submitTransaction(mintTxn)
      .then((res) => {
        transactionId = res.id;
      })
      .catch((ex) => {
        console.log({ ex });
        return httpErrorHandler(res, 401, "An error has occured");
      });

    // Get Transaction Challenge
    const getChallenge = async () => {
      return new Promise((resolve) => {
        const MAX = 20;
        let counter: number = 1;
        let interval = setInterval(async () => {
          return custonomy
            .getTransaction(transactionId)
            .then((res) => {
              console.log("All signers:", res.allsigners);
              const myPending = res.allsigners.find(
                (signer: Object) =>
                  signer.authorizerId == userId &&
                  !signer.sign &&
                  !signer.signature
              );
              console.log("My Pending:", myPending);

              if (!myPending) {
                console.warn(
                  "Not pending for authorization from current user."
                );
                clearInterval(interval);
                return resolve(false);
              }

              if (++counter > MAX || myPending.challenge?.length > 0) {
                pendingTransaction = myPending;
                clearInterval(interval);
                return resolve(true);
              }

              console.log("Transaction challenge is not ready yet...");
            })
            .catch((ex) => {
              console.error({ ex });
              return httpErrorHandler(res, 401, "An error has occured");
            });
        }, 5000);
      });
    };

    await getChallenge();

    // Authorize Pending Transaction if any
    if (Object.keys(pendingTransaction).length !== 0) {
      console.log("Now authorizing pending transaction...");
      const challenge: string = pendingTransaction.challenge;
      const masterKey: string = getECPublicKey(ecPrivateKey);
      const signature: string = ecSign(sha256(challenge), ecPrivateKey);

      await custonomy
        .authorizeTransaction(transactionId, {
          challenge,
          masterKey,
          signature,
        })
        .then((res) => {
          console.log("Transaction signed successfully");
        })
        .catch((ex) => {
          console.error(ex);
          return httpErrorHandler(res, 401, "An error has occured");
        });
    } else {
      console.log("No pending transaction, processing transaction now");
    }

    // Get Transaction and Check Status
    const getTransaction = async () => {
      return new Promise((resolve) => {
        const MAX = 20;
        let counter: number = 1;
        let interval = setInterval(async () => {
          return custonomy
            .getTransaction(transactionId)
            .then((res) => {
              const COMPLETE_STATUS = ["error", "sent", "completed"];
              if (COMPLETE_STATUS.includes(res.status)) {
                console.log(
                  `Transaction signing completed. Status: ${res.status}`
                );
                if (res.status == "error") {
                  console.log("Err Reason", res);
                }
                transactionOutcome = res.status;
                txnHash = res.txnId;
                clearInterval(interval);
                return resolve(true);
              }

              if (++counter > MAX) {
                console.log(`Timeout. Transaction status: ${res.status}`);
                clearInterval(interval);
                return resolve(false);
              }

              console.log("Transaction signing is not complete yet...");
              console.log(res.status);
            })
            .catch((ex) => {
              console.error({ ex });
              throw ex;
            });
        }, 5000);
      });
    };

    await getTransaction();

    // Return transaction ID upon success
    if (transactionOutcome == "sent" || transactionOutcome == "completed") {
      try {
        const newStatus = {
          payment_id: req.body.id,
          payment_status: "success",
          nft_minted: true,
          txn_hash: txnHash,
        };

        const newTransaction = await OrderModel.updateTx(newStatus, trx);
        await Model.commit(trx);
        console.log("Updated Transaction Data:", newTransaction);
      } catch (error) {
        Model.rollback(trx, error);
        return httpErrorHandler(res, 401, JSON.stringify(error));
      }

      res.status(200).send({ hash: txnHash });
    } else {
      return httpErrorHandler(res, 401, "An error has occured");
    }
  }
};
