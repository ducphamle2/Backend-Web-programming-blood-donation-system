const express = require("express");

const controller = require("./bloodFormController.js");
const authMiddleware = require("../../middlewares/authMiddleware.js");
const { check } = require("express-validator/check");

const router = express.Router()

router.get("/blood_form/", authMiddleware, [], controller.getBloodForm);

router.post("/blood_form", authMiddleware, [
    check("event_id").isLength({ min: 32, max: 32 })
], controller.postBloodForm);

module.exports = router;
