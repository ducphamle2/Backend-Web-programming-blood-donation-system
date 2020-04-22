const express = require("express");

const controller = require("./eventController.js");
const authMiddleware = require("../../middlewares/authMiddleware.js");
const { check } = require("express-validator/check");

const router = express.Router();

router.post("/create_event", authMiddleware, [
  check("date").
    matches(/^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/, "i"),
  check("red_cross_name").isLength({ min: 3, max: 99 }),
  check("name").isLength({ min: 3, max: 99 }),
  check("location").isLength({ min: 3, max: 99 })
],
  controller.createEvent);

router.post("/update_event", authMiddleware, controller.updateEvent);

router.post("/delete_event", authMiddleware, controller.deleteEvent);

router.post("/search_with_name",
  check("name").isLength({ min: 3, max: 99 })
  , authMiddleware, controller.searchEventWithName);

router.post("/search_with_date", check("date").
  matches(/^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/, "i"), authMiddleware, controller.searchEventWithDate);

module.exports = router;
