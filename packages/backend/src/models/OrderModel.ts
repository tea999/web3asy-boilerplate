
import { knex } from "../utils/constants";
const RETURN_FIELDS = ["payment_id", "payment_status", "nft_minted", "txn_hash"]

const getByTxID = async (paymentIntent: string, db?: any): Promise<any | null> => {
    const _knex = db ?? knex;
    let query = _knex("transactions").select(RETURN_FIELDS);
    if (paymentIntent) query = query.where("payment_id", paymentIntent);

    const tx = await query
    return tx[0]
};

const createTx = async (paymentIntent: any, db?: any) => {
  const _knex = db ?? knex;
  let newTx = null;
  newTx = await _knex("transactions")
    .insert({
        payment_id: paymentIntent.id,
        payment_status: "success",
        nft_minted: false,
        txn_hash: null
    })
    .returning(RETURN_FIELDS);

  return newTx[0];
};

const updateTx = async (newStatus: any, db?: any) => {
  const _knex = db ?? knex;

  const newTx = await _knex("transactions").where("payment_id", newStatus.payment_id).update(newStatus).returning(RETURN_FIELDS);
  return newTx[0];
};

export default { getByTxID, createTx, updateTx };
