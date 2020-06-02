const express = require("express");

const controller = require("./notificationController.js");
const authMiddleware = require("../../middlewares/authMiddleware.js");
const { check } = require("express-validator/check");

const router = express.Router();

router.get("/get_notifications", controller.getAllNotifications)

module.exports = router;
