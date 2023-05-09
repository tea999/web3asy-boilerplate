export const CHAIN_ID: string = process.env.CHAIN_ID ?? "80001";
export const DEFAULT_ENDPOINT: string = process.env.DEFAULT_ENDPOINT ?? "";

const GAS_ENDPOINT_SET: any = {
  137: process.env.MAINNET_GAS ?? "https://gasstation-mainnet.matic.network/v2",
  80001: process.env.TESTNET_GAS ?? "https://gasstation-mumbai.matic.today/v2",
};
// export const MAINNET_GAS: string =
//   process.env.MAINNET_GAS ?? "https://gasstation-mainnet.matic.network/v2";
// export const TESTNET_GAS: string =
//   process.env.TESTNET_GAS ?? "https://gasstation-mumbai.matic.today/v2";
export const GAS_ENDPOINT = GAS_ENDPOINT_SET[parseInt(CHAIN_ID)];

// Full Custody Model
export const TENANT: string = process.env.TENANT ?? "";
export const API_KEY: string = process.env.API_KEY ?? "";
export const API_SECRET: string = process.env.API_SECRET ?? "";
export const MINTER_ADDRESS: string = process.env.MINTER_ADDRESS ?? "";
export const EC_KEY: string = process.env.EC_KEY ?? "";
