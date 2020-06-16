const express = require("express");

const controller = require("./redcrossController");
const authMiddleware = require("../../middlewares/authMiddleware.js");
const { check } = require("express-validator/check");
const bloodtypeMiddleware = require("../../middlewares/bloodtypeMiddleware");
const DonationSelectMiddleware = require("../../middlewares/DonationSelectMiddleware");

const router = express.Router();

router.get("/get_pending_orders", authMiddleware, controller.getPendingOrders);

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
router.get("/get_pending_events", authMiddleware, controller.getPendingEvents);
router.get("/get_donors", authMiddleware, controller.getDonors);
router.get(
  "/get_donors_detail/:id",
  authMiddleware,
  controller.getDonorsDetail
);
router.get("/get_hospitals", authMiddleware, controller.getHospitals);
router.get(
  "/get_hospitals_detail/:id",
  authMiddleware,
  controller.getHospitalsDetail
);
router.get("/get_organizers", authMiddleware, controller.getOrganizers);
router.get(
  "/get_organizers_detail/:id",
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
  "/get_accepted_orders_detail/:id",
  authMiddleware,
  controller.getacceptedOrdersDetail
);
router.get(
  "/get_accepted_events_detail/:id",
  authMiddleware,
  controller.getacceptedEventssDetail
);
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
router.post(
  "/test_blood/:id",
  authMiddleware,
  function (req, res, next) {
    if (process.env.ENVIRONMENT !== "PRODUCTION")
      bloodtypeMiddleware(req, res, next);
    else next();
  },
  controller.testBlood
);
router.get(
  "/view_donation_list/:id",
  authMiddleware,
  controller.viewDonationList
);
module.exports = router;
