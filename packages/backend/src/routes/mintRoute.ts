const router = require("express").Router();

import { mintNFT } from "../controllers/authController";


router.post('/', mintNFT);

module.exports = router;
