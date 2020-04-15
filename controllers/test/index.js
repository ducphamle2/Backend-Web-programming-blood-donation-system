const express = require("express");

const controller = require("./test.js");

const router = express.Router();

router.post("/test", controller.test);

module.exports = router;