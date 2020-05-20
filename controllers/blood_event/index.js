const express = require("express");

const controller = require("./eventController.js");
const authMiddleware = require("../../middlewares/authMiddleware.js");
const { check } = require("express-validator/check");

const router = express.Router();

router.post("/create_event", authMiddleware, [
  check("name").isLength({ min: 3, max: 99 }),
  check("date").isInt(),
  check("location").isLength({ min: 3, max: 99 })
],
  controller.createEvent);

router.post("/update_event/:id", [
  check("id").isLength({ min: 32, max: 32 }),
  check("date").isInt(),
  check("red_cross_id").isLength({ min: 32, max: 32 }),
  check("name").isLength({ min: 3, max: 99 }),
  check("location").isLength({ min: 3, max: 99 })
], authMiddleware, controller.updateEvent);

// CHECK LENGTH OF ALL IDS IN THE ARRAY OF ID
router.delete("/delete_events", authMiddleware, [
  check("ids").isArray(),
  check('ids.*.id').isLength({ min: 32, max: 32 })
], controller.deleteEvents);

router.get("/search_with_name",
  check("name").isLength({ min: 3, max: 99 })
  , controller.searchEventWithName);

router.post("/search_with_date", check("date").isInt(), controller.searchEventWithDate);

router.get("/get_events", controller.getAllEvents)

router.get("/search_event/:id", authMiddleware, controller.searchEventWithId)

module.exports = router;
