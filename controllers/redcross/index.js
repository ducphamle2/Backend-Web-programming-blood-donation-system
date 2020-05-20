const express = require("express");

const controller = require("./redcrossController");
const authMiddleware = require("../../middlewares/authMiddleware.js");
const { check } = require("express-validator/check");

const router = express.Router();

router.get("/getpendingEvents", authMiddleware, controller.getpendingEvents);

router.put(
  "/acceptedevent/:id",
  check("id").isLength({ min: 32, max: 32 }),
  authMiddleware,
  controller.acceptEvents
);

router.put(
  "/rejectevent/:id",
  check("id").isLength({ min: 32, max: 32 }),
  authMiddleware,
  controller.rejectEvents
);

router.get("/getstore", authMiddleware, controller.getStore);
router.get("/getbloodDonation", authMiddleware, controller.getbloodDonation);
router.post(
  "/store/:id",
  authMiddleware,
  check("id").isLength({ min: 32, max: 32 }),
  controller.store
);

module.exports = router;
