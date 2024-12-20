const User = require("../models/User")
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");

const router = require("express").Router();

// create
router.post("/", verifyTokenAndAdmin, async (req,res) => {
    console.log("create new user")
    const newUser = new User(req.body);
    try {
        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
})

// update
router.put("/:id", verifyTokenAndAuthorization, async (req,res) => {
    console.log("update user!");
    console.log(req.params.id);
    console.log("finish");
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC)
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },
        { new: true});
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
})

// delete
router.delete("/:id", verifyTokenAndAuthorization, async (req,res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted");
    } catch (err) {
        res.status(500).json(err);
    }
})

// get user
router.get("/find/:id", verifyTokenAndAdmin, async (req,res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others} = user._doc;
        res.status(200).json({...others});
    } catch (err) {
        res.status(500).json(err);
    }
})

// get all users
router.get("/", verifyTokenAndAdmin, async (req,res) => {
    const query = req.query.new;
    try {
        const users = query? await User.find().sort({createdAt: -1}).limit(5): await User.find();
        //console.log("USERS\n",users);
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
})

// users stats
router.get("/stats", verifyTokenAndAdmin, async (req,res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await User.aggregate([
            {
                $match: {
                    createdAt: {$gte: lastYear}
                }
            },
            {
                $project: {
                    month: {$month: "$createdAt"},
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum: 1},
                }
            }
        ])
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router