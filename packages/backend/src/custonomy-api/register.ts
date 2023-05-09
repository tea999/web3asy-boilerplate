import fs from "fs";
import { generateECPrivateKey } from "./src/utils/util";
import path from "path";

import { Custonomy } from "./src";

require("dotenv").config();

const registerKey = async () => {
  const profile: Object = {};
  let ecPrivateKey: string;
  let userId: string;

  // Generate EC Key
  ecPrivateKey = generateECPrivateKey();

  // Initialize Custonomy
  const custonomy = new Custonomy(
    process.env.API_KEY as string,
    process.env.API_SECRET as string,
    process.env.DEFAULT_ENDPOINT as string,
    process.env.TENANT as string
  );

  // Register EC Key
  await custonomy
    .registerMasterKey(ecPrivateKey)
    .then((res) => {
      userId = res.id;

      process.env.EC_KEY = ecPrivateKey;
      const envDataToAppend = `EC_KEY=${ecPrivateKey}\n`;

      fs.appendFileSync(
        path.join(__dirname, "../../.env"),
        `\n${envDataToAppend}`
      );

      console.log("EC key registration successful. appended to .env");
    })
    .catch((ex) => {
      console.error({ ex });
      throw ex;
    });
};

registerKey();
