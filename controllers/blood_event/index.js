const express = require("express");

const controller = require("./eventController.js");
const authMiddleware = require("../../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/create_event", authMiddleware, controller.createEvent);

router.post("/update_event", authMiddleware, controller.updateEvent);

router.post("/delete_event", authMiddleware, controller.deleteEvent);

module.exports = router;
