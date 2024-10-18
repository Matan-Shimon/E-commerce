const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// register
router.post("/register", async (req,res) => {
    console.log("im here!");
    console.log(process.env.PASS_SEC);
    console.log(req.body);
    const newUser = new User({
        fullname: req.body.fullname,
        username: req.body.username,
        email: req.body.email,
        address: req.body.address,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC),
        isAdmin: req.body.isAdmin
    })

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser)
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
})

// login
router.post("/login", async (req,res) => {
    try {
        const user = await User.findOne({ username: req.body.username});
        
        // Check if user exists
        if (!user) {
            return res.status(401).json("username does not exist!");
        }
        
        // Decrypt the password
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        
        // Check if password is correct
        if (originalPassword !== req.body.password) {
            return res.status(401).json("wrong password!");
        }
        
        // Generate access token
        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        },
        process.env.JWT_SEC,
        {expiresIn: "3d"})

        // Exclude password from response
        const { password, ...others} = user._doc;
        
        // Send successful response
        return res.status(201).json({...others, accessToken})
    } catch (err) {
        return res.status(500).json(err)
    }
})

module.exports = router