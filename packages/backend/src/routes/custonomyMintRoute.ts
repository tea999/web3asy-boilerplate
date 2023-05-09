const router = require("express").Router();

import { mintNFT } from "../custonomy-api";


router.post('/', mintNFT);

module.exports = router;
