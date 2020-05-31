const express = require("express");

const controller = require("./bloodOrderController.js");
const authMiddleware = require("../../middlewares/authMiddleware.js");
const { check } = require("express-validator/check");

const router = express.Router();

router.post("/create_order", authMiddleware, [
    check("date").matches(/^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/, "i"),

],
    controller.createOrder);

router.post("/update_order_info/:id", [
    check("id").isLength({ min: 32, max: 32 }),
    check("date").exists().
        matches(/^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/, "i"),
],
    authMiddleware,
    controller.updateOrderInfo);

router.post("/update_order_status/:id", [
    check("id").isLength({ min: 32, max: 32 }),
    check("date").exists().
        matches(/^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/, "i"),
],
    authMiddleware,
    controller.updateOrderStatus);

router.delete("/delete_order/:id", authMiddleware, [
    check("id").isLength({ min: 32, max: 32 }),
],
    controller.deleteOrder);

router.post("/search_with_date",
    check("date").
        matches(/^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/, "i"),
    controller.searchOrderWithDate);

router.get("/get_orders", controller.getAllOrders)

module.exports = router;