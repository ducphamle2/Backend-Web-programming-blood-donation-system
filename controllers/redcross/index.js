const express = require("express");

const controller = require("./redcrossController");
const authMiddleware = require("../../middlewares/authMiddleware.js");
const { check } = require("express-validator/check");

const router = express.Router();

router.get("/getpendingOrders",authMiddleware, controller.getpendingOrders);

router.put(
  "/acceptedorder/:id",
  check("id").isLength({ min: 32, max: 32 }),
  authMiddleware,
  controller.acceptOrders
);

router.put(
  "/rejectorder/:id",
  check("id").isLength({ min: 32, max: 32 }),
  authMiddleware,
  controller.rejectOrders
);
router.get("/getpendingEvents", authMiddleware, controller.getpendingEvents);
router.get("/getDonors", authMiddleware, controller.getDonors);
router.get("/getHospitals", authMiddleware, controller.getHospitals);
router.get("/getOrganizers", authMiddleware, controller.getOrganizers);
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
router.put(
  "/rejectdonation/:id",
  check("id").isLength({ min: 32, max: 32 }),
  authMiddleware,
  controller.rejectDonation
);
router.get("/getstore", authMiddleware, controller.getStore);
router.get("/getbloodDonation", authMiddleware, controller.getbloodDonation);
router.get("/get_approved_events", controller.getAllApprovedEvents);
router.get(
  "/getUntestedBloodDonation",
  authMiddleware,
  controller.getUntestedBloodDonation
);
router.get("/getAcceptedEvents", authMiddleware, controller.getacceptedEvents);
router.get("/getAcceptedOrders", authMiddleware, controller.getacceptedOrders);
router.get(
  "/getStoredBloodDonations",
  authMiddleware,
  controller.getstoredbloodDonation
);
router.post(
  "/store/:id",
  authMiddleware,
  check("id").isLength({ min: 32, max: 32 }),
  controller.store
);
router.post(
  "/reactivate/:id",
  authMiddleware,
  check("id").isLength({ min: 32, max: 32 }),
  controller.reactivateAccount
);
router.post(
  "/banned/:id",
  authMiddleware,
  check("id").isLength({ min: 32, max: 32 }),
  controller.bannedAccount
);
router.post("/testBlood/:id", authMiddleware, controller.testBlood);
module.exports = router;
