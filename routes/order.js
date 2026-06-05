const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const isLoggedIn = require("../middleware/auth");


// PLACE ORDER
router.get("/place", isLoggedIn, async (req, res) => {

    const cart = req.session.cart || [];

    if (cart.length === 0) {
        return res.redirect("/cart");
    }

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
    });

    const order = new Order({
        userId: req.session.userId,

        items: cart.map(item => ({
            productId: item.productId,
            title: item.title,
            price: item.price,
            qty: item.qty,
            image: item.image   // ✅ IMPORTANT FIX
        })),

        total
    });

    await order.save();

    req.session.success = "Order Placed Successfully!";
    req.session.cart = [];

    res.redirect("/orders");
});

// MY ORDERS PAGE
router.get("/", isLoggedIn, async (req, res) => {

    const orders = await Order.find({
        userId: req.session.userId
    });

    res.render("orders/index", { orders });
});
router.get("/cancel/:id", async (req, res) => {

    try {
        await Order.findByIdAndUpdate(req.params.id, {
            status: "Cancelled"
        });

        req.session.success = "Order Cancelled Successfully";

        res.redirect("/orders");

    } catch (err) {
        console.log(err);
        res.redirect("/orders");
    }

});


// EXPORT
module.exports = router;