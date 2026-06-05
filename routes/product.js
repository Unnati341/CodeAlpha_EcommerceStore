
// const express = require("express");
// const router = express.Router();

// const Product = require("../models/Product");
// const isLoggedIn = require("../middleware/auth");


// // INDEX ROUTE
// router.get("/", async (req, res) => {
//     const products = await Product.find({});
//     res.render("products/index", { products });
// });


// // NEW ROUTE
// router.get("/new", (req, res) => {
//     res.render("products/new");
// });


// // CREATE ROUTE
// router.post("/", async (req, res) => {
//     const newProduct = new Product(req.body);

//     await newProduct.save();

//     res.redirect("/products");
// });


// // SHOW ROUTE
// router.get("/:id", async (req, res) => {
//     const { id } = req.params;

//     const product = await Product.findById(id);

//     res.render("products/show", { product });
// });


// // EDIT ROUTE
// router.get("/:id/edit", async (req, res) => {
//     const { id } = req.params;

//     const product = await Product.findById(id);

//     res.render("products/edit", { product });
// });


// // UPDATE ROUTE
// router.put("/:id", async (req, res) => {
//     const { id } = req.params;

//     await Product.findByIdAndUpdate(id, req.body);

//     res.redirect(`/products/${id}`);
// });


// // DELETE ROUTE
// router.delete("/:id", async (req, res) => {
//     const { id } = req.params;

//     await Product.findByIdAndDelete(id);

//     res.redirect("/products");
// });

// module.exports = router;
const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const isLoggedIn = require("../middleware/auth");

// INDEX
router.get("/", async (req, res) => {

    const search = req.query.search;

    let products;

    if (search) {

        products = await Product.find({
            title: {
                $regex: search,
                $options: "i"
            }
        });

    } else {

        products = await Product.find({});

    }

    res.render("products/index", { products });

});

// NEW
router.get("/new", isLoggedIn, (req, res) => {
    res.render("products/new");
});

// CREATE
router.post("/", isLoggedIn, async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect("/products");
});

// SHOW
router.get("/:id", async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render("products/show", { product });
});

// EDIT
router.get("/:id/edit", isLoggedIn, async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render("products/edit", { product });
});

// UPDATE
router.put("/:id", isLoggedIn, async (req, res) => {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/products/${req.params.id}`);
});

// DELETE
router.delete("/:id", isLoggedIn, async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/products");
});

module.exports = router;