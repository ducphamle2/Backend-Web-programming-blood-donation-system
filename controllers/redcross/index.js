const express = require("express");

const controller = require("./redcrossController");
const authMiddleware = require("../../middlewares/authMiddleware.js");
const { check } = require("express-validator/check");
const bloodtypeMiddleware = require("../../middlewares/bloodtypeMiddleware");
const DonationSelectMiddleware = require("../../middlewares/DonationSelectMiddleware");

const router = express.Router();

router.get("/getpendingOrders", authMiddleware, controller.getPendingOrders);

router.put(
  "/accepted_order/:id",
  check("id").isLength({ min: 32, max: 32 }),
  authMiddleware,
  controller.acceptOrders,
  function (req, res, next) {
    DonationSelectMiddleware(req, res, next, controller.issueDonation);
  }
);
router.put(
  "/reject_order/:id",
  check("id").isLength({ min: 32, max: 32 }),
  authMiddleware,
  controller.rejectOrders
);
router.get("/getpendingEvents", authMiddleware, controller.getPendingEvents);
router.get("/getDonors", authMiddleware, controller.getDonors);
router.get("/getDonorsDetail/:id", authMiddleware, controller.getDonorsDetail);
router.get("/getHospitals", authMiddleware, controller.getHospitals);
router.get(
  "/getHospitalsDetail/:id",
  authMiddleware,
  controller.getHospitalsDetail
);
router.get("/getOrganizers", authMiddleware, controller.getOrganizers);
router.get(
  "/getOrganizersDetail/:id",
  authMiddleware,
  controller.getOrganizersDetail
);
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
router.get(
  "/get_accepted_events",
  authMiddleware,
  controller.getAcceptedEvents
);
router.get(
  "/get_accepted_orders",
  authMiddleware,
  controller.getAcceptedOrders
);
router.get(
  "/getAcceptedOrdersDetail/:id",
  authMiddleware,
  controller.getacceptedOrdersDetail
);
router.get(
  "/getAcceptedEventsDetail/:id",
  authMiddleware,
  controller.getacceptedEventssDetail
);
router.get(
  "/getStoredBloodDonations",
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
router.post(
  "/testBlood/:id",
  authMiddleware,
  function (req, res, next) {
    if (process.env.ENVIRONMENT !== "PRODUCTION")
      bloodtypeMiddleware(req, res, next);
    else next();
  },
  controller.testBlood
);
router.get(
  "/viewDonationList/:id",
  authMiddleware,
  controller.viewDonationList
);
module.exports = router;
