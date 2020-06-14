const express = require("express");

const controller = require("./redcrossController");
const authMiddleware = require("../../middlewares/authMiddleware.js");
const { check } = require("express-validator/check");

const router = express.Router();

router.get("/get_pending_orders", controller.getPendingOrders);

router.put(
  "/accepted_order/:id",
  check("id").isLength({ min: 32, max: 32 }),
  authMiddleware,
  controller.acceptOrders
);

router.put(
  "/reject_order/:id",
  check("id").isLength({ min: 32, max: 32 }),
  authMiddleware,
  controller.rejectOrders
);
router.get("/get_pending_events", authMiddleware, controller.getPendingEvents);
router.get("/get_donors", authMiddleware, controller.getDonors);
router.get("/get_hospitals", authMiddleware, controller.getHospitals);
router.get("/get_organizers", authMiddleware, controller.getOrganizers);
router.put(
  "/accepted_event/:id",
  check("id").isLength({ min: 32, max: 32 }),
  authMiddleware,
  controller.acceptEvents
);

router.put(
  "/reject_event/:id",
  check("id").isLength({ min: 32, max: 32 }),
  authMiddleware,
  controller.rejectEvents
);
router.put(
  "/reject_donation/:id",
  check("id").isLength({ min: 32, max: 32 }),
  authMiddleware,
  controller.rejectDonation
);
router.get("/get_store", authMiddleware, controller.getStore);
router.get("/get_blood_donation", authMiddleware, controller.getBloodDonation);
router.get("/get_approved_events", controller.getAllApprovedEvents);
router.get(
  "/get_untested_blood_donation",
  authMiddleware,
  controller.getUntestedBloodDonation
);
router.get("/get_accepted_events", authMiddleware, controller.getAcceptedEvents);
router.get("/get_accepted_orders", authMiddleware, controller.getAcceptedOrders);
router.get(
  "/get_stored_blood_donations",
  authMiddleware,
  controller.getStoredBloodDonation
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
router.post("/test_blood/:id", authMiddleware, controller.testBlood);
module.exports = router;
