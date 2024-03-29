export const config = {
  ALCHEMY_API_KEY: process.env.REACT_APP_ALCHEMY_API_KEY ?? "",
  INFURA_LINK: process.env.REACT_APP_INFURA_LINK ?? "",
  CUSTONOMY_PROJECT_ID: process.env.REACT_APP_CUSTONOMY_PROJECT_ID ?? "",
  CUSTONOMY_API_KEY: process.env.REACT_APP_CUSTONOMY_API_KEY ?? "",
  CUSTONOMY_END_POINT: process.env.REACT_APP_CUSTONOMY_END_POINT ?? "",
  CUSTONOMY_WIDGET_URL: process.env.REACT_APP_CUSTONOMY_WIDGET_URL ?? "",
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL ?? "",
  CHAIN_ID: process.env.REACT_APP_CHAIN_ID ?? "0x89",
  STRIPE_PKEY: process.env.REACT_APP_STRIPE_PKEY ?? "",
  CONTRACT: {
    COOL_BEAR:
      process.env.REACT_APP_CONTRACT_COOL_BEAR ??
      "0x49c0987fba4530606Ac465dbd215dc8a0ce9e511",
    LUCKY_CAT:
      process.env.REACT_APP_CONTRACT_LUCKY_CAT ??
      "0x1d2EBDdFF398259dB8F26d52beA2B78c68dE7682",
    LUCKY_CHIPMUNK:
      process.env.REACT_APP_CONTRACT_LUCKY_CHIPMUNK ??
      "0xF99B0334ad968e27f01eDc12cc239d1E3523d75F",
    LUCKY_CRAB:
      process.env.REACT_APP_CONTRACT_LUCKY_CRAB ??
      "0xA64B8F630E4b034361208F053b05B46Da4B251Cd",
  },
  WINTER_PROJECT_ID: {
    LUCKY_CAT: process.env.REACT_APP_WINTER_PROJECT_ID_LUCKY_CAT ?? 7114,
    LUCKY_CHIPMUNK:
      process.env.REACT_APP_WINTER_PROJECT_ID_LUCKY_CHIPMUNK ?? 7118,
    LUCKY_CRAB: process.env.REACT_APP_WINTER_PROJECT_ID_LUCKY_CRAB ?? 7116,
  },
};
