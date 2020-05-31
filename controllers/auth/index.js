const express = require("express");
const { check } = require("express-validator/check");
const authMiddleware = require("../../middlewares/authMiddleware.js");

const controller = require("./authController.js");

const router = express.Router();

router.post(
  "/login",
  [
    check("role").isLength({ min: 3, max: 20 }),
    check("email").isEmail(),
    check("password").exists(),
  ],
  controller.login
);

router.post(
  "/register",
  [
    check("role").isLength({ min: 3, max: 20 }),
    check("phone").optional().isMobilePhone(),
    check("address").optional().isLength({ min: 3, max: 85 }),
    check("blood_type").optional().isLength({ min: 1, max: 5 }),
    check("password").exists(),
    check("name").isLength({ min: 5, max: 99 }),
    check("email").isEmail(),
  ],
  // check("password", "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long")
  //   .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
  controller.register
);

router.post("/update", [
    check("email").isEmail(),
    check("name").isLength({ min: 5, max: 99 }),
], authMiddleware, controller.updateUserProfile);

router.get("/", authMiddleware, controller.getUser)

module.exports = router;
