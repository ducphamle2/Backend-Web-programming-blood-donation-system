const express = require("express");

const controller = require("./bloodOrderController.js");
const authMiddleware = require("../../middlewares/authMiddleware.js");
const { check } = require("express-validator/check");

const router = express.Router();

router.post("/create_order", authMiddleware, [
    check("date").isInt(),

],
    controller.createOrder);

router.post("/update_order_info/:id", [
    check("id").isLength({ min: 32, max: 32 }),
    check("date").isInt(),
],
    authMiddleware,
    controller.updateOrderInfo);

// router.post("/update_order_status/:id", [
//     check("id").isLength({ min: 32, max: 32 }),
//     check("date").isInt(),
// ],
//     authMiddleware,
//     controller.updateOrderStatus);

router.delete("/delete_order/:id", authMiddleware, [
    check("id").isLength({ min: 32, max: 32 }),
],
    controller.deleteOrder);

router.post("/search_with_date",
    check("date").isInt(),
    controller.searchOrderWithDate);

router.post("/send_order/:id", [
    check("id").isLength({ min: 32, max: 32 }),
],
    authMiddleware,
    controller.sendOrder);

router.get("/get_orders", authMiddleware, controller.getAllOrders)
router.get("/get_sent_orders", authMiddleware, controller.getAllSentOrders)
router.get("/get_unsent_orders", authMiddleware, controller.getAllUnsentOrders)
router.get("/get_order/:id", authMiddleware, controller.getOrderWithID)

module.exports = router;