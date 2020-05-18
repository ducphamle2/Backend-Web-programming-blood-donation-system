const express = require("express");

const controller = require("./eventController.js");
const authMiddleware = require("../../middlewares/authMiddleware.js");
const { check } = require("express-validator/check");

const router = express.Router();

router.post(
  "/create_event",
  authMiddleware,
  [
    check("date").isLength({ min: 3, max: 99 }),
    check("name").isLength({ min: 3, max: 99 }),
    check("location").isLength({ min: 3, max: 99 }),
  ],
  controller.createEvent
);

router.post(
  "/update_event/:id",
  [
    check("id").isLength({ min: 32, max: 32 }),
    check("date")
      .exists()
      .matches(
        /^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/,
        "i"
      ),
    check("red_cross_id").isLength({ min: 32, max: 32 }),
    check("name").isLength({ min: 3, max: 99 }),
    check("location").isLength({ min: 3, max: 99 }),
  ],
  authMiddleware,
  controller.updateEvent
);

router.delete(
  "/delete_event/:id",
  authMiddleware,
  [check("id").isLength({ min: 32, max: 32 })],
  controller.deleteEvent
);

router.get(
  "/search_with_name",
  check("name").isLength({ min: 3, max: 99 }),
  controller.searchEventWithName
);

router.post(
  "/search_with_date",
  check("date").matches(
    /^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/,
    "i"
  ),
  controller.searchEventWithDate
);

router.get("/get_events", controller.getAllEvents);

module.exports = router;
