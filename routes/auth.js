// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");

// const User = require("../models/User");


// router.get("/register", (req, res) => {
//     res.render("auth/register");
// });
// router.post("/register", async (req, res) => {
//     const { username, email, password } = req.body;

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({
//         username,
//         email,
//         password: hashedPassword
//     });

//     await user.save();

//     res.redirect("/login");
// });
// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) return res.send("User not found");

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) return res.send("Invalid password");

//     req.session.userId = user._id;
//     req.session.username = user.username;

//     res.redirect("/products");
// });
// router.get("/logout", (req, res) => {
//     req.session.destroy();
//     res.redirect("/login");
// });
// module.exports = router;

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User");

router.get("/register", (req, res) => {
    res.render("auth/register");
});

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        email,
        password: hashedPassword
    });

    await user.save();

    res.redirect("/login");
});

router.get("/login", (req, res) => {
    res.render("auth/login");
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.send("User not found");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.send("Invalid password");

    req.session.userId = user._id;
    req.session.username = user.username;
    

    res.redirect("/products");
});
router.get("/logout", (req, res) => {

    req.session.destroy((err) => {
        if (err) return res.redirect("/");

        res.clearCookie("connect.sid");

        req.session = null;

        res.redirect("/");
    });

});


module.exports = router;