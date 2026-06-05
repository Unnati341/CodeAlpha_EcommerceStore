// const express = require("express");
// const mongoose = require("mongoose");
// const session = require("express-session");
// const MongoStore = require("connect-mongo");
// const path = require("path");
// const methodOverride = require("method-override");
// const productRoutes = require("./routes/product");
// const authRoutes = require("./routes/auth");



// const app = express();

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.use(express.static(path.join(__dirname, "public")));
// app.use("/products", productRoutes);
// app.use("/", authRoutes);

// mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
// .then(() => {
//     console.log("MongoDB Connected");
// })

// .catch((err) => {
//     console.log(err);
// });

// app.use(session({
//     secret: "mysecretkey",
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//         mongoUrl: "mongodb://127.0.0.1:27017/ecommerce"
//     }),
//     cookie: {
//         maxAge: 1000 * 60 * 60 * 24 // 1 day
//     }
// }));
// app.use((req, res, next) => {
//     res.locals.user = {
//         username: req.session.username,
//         id: req.session.userId
//     };
//     next();
// });

// app.get("/", (req, res) => {
//     res.send("E-commerce App Running");
// });


// app.listen(3000, () => {
//     console.log("Server Running On Port 3000");
// });

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const methodOverride = require("method-override");

const productRoutes = require("./routes/product");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const Product = require("./models/Product");
const app = express();


// =========================
// VIEW ENGINE SETUP
// =========================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// =========================
// BASIC MIDDLEWARE
// =========================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));



// =========================
// DATABASE CONNECTION
// =========================
mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log("MongoDB Error:", err);
});


// =========================
// SESSION SETUP
// =========================
app.use(session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: "mongodb://127.0.0.1:27017/ecommerce"
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));


// =========================
// GLOBAL USER (FOR EJS)
// =========================
app.use((req, res, next) => {
    res.locals.user = req.session.userId
        ? {
            username: req.session.username,
            id: req.session.userId
          }
        : null;
         const cart = req.session.cart || [];

    let cartCount = 0;

    cart.forEach(item => {
        cartCount += item.qty;
    });

    res.locals.cartCount = cartCount;

    next();
});
app.use((req, res, next) => {

    res.locals.success = req.session.success;

    delete req.session.success;

    next();
});


// =========================
// ROUTES
// =========================
app.use("/", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

// =========================
// HOME ROUTE
// =========================
// app.get("/", (req, res) => {
//     res.redirect("/products");
// });

// app.get("/", (req, res) => {
//     res.render("home");
// });
app.get("/", async (req, res) => {

    const products = await Product.find();

    res.render("home", { products });

});
// =========================
// START SERVER
// =========================
app.listen(3000, () => {
    console.log("Server running on port 3000");
});