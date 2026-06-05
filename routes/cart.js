// const express = require("express");
// const router = express.Router();

// const Product = require("../models/Product");


// // =========================
// // ADD TO CART
// // =========================
// router.get("/add/:id", async (req, res) => {
//     const product = await Product.findById(req.params.id);

//     if (!req.session.cart) {
//         req.session.cart = [];
//     }

//     let cart = req.session.cart;

//     let existingProduct = cart.find(item => item.productId == req.params.id);

//     if (existingProduct) {
//         existingProduct.qty += 1;
//     } else {
//         cart.push({
//             productId: product._id,
//             title: product.title,
//             price: product.price,
//             image: product.image,
//             qty: 1
//         });
//     }

//     req.session.cart = cart;

//     res.redirect("/cart");
// });


// // =========================
// // VIEW CART
// // =========================
// router.get("/", (req, res) => {
//     const cart = req.session.cart || [];
//     res.render("cart/index", { cart });
// });


// // =========================
// // REMOVE ITEM
// // =========================
// router.get("/remove/:id", (req, res) => {
//     let cart = req.session.cart || [];

//     cart = cart.filter(item => item.productId != req.params.id);

//     req.session.cart = cart;

//     res.redirect("/cart");
// });


// // =========================
// // CLEAR CART
// // =========================
// router.get("/clear", (req, res) => {
//     req.session.cart = [];
//     res.redirect("/cart");
// });


// module.exports = router;

const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const isLoggedIn = require("../middleware/auth");

router.get("/add/:id", isLoggedIn ,async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!req.session.cart) req.session.cart = [];

    let cart = req.session.cart;

    let item = cart.find(p => p.productId == req.params.id);

    if (item) {
        item.qty += 1;
    } else {
        cart.push({
            productId: product._id,
            title: product.title,
            price: product.price,
            image: product.image,
            qty: 1
        });
    }

    req.session.cart = cart;
    res.redirect("/cart");
});

router.get("/", (req, res) => {
    res.render("cart/index", { cart: req.session.cart || [] });
});

router.get("/remove/:id", (req, res) => {
    let cart = req.session.cart || [];
    cart = cart.filter(i => i.productId != req.params.id);
    req.session.cart = cart;
    res.redirect("/cart");
});

router.get("/clear", (req, res) => {
    req.session.cart = [];
    res.redirect("/cart");
});

router.get("/increase/:id", (req, res) => {

    let cart = req.session.cart || [];

    let item = cart.find(
        p => p.productId == req.params.id
    );

    if(item){
        item.qty += 1;
    }

    req.session.cart = cart;

    res.redirect("/cart");
});
router.get("/decrease/:id", (req, res) => {

    let cart = req.session.cart || [];

    let item = cart.find(
        p => p.productId == req.params.id
    );

    if(item){

        item.qty -= 1;

        if(item.qty <= 0){

            cart = cart.filter(
                p => p.productId != req.params.id
            );
        }
    }

    req.session.cart = cart;

    res.redirect("/cart");
});
module.exports = router;