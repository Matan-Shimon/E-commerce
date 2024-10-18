const Product = require("../models/Product")
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");

const router = require("express").Router();

// create
router.post("/", verifyTokenAndAdmin, async (req,res) => {
    const newProduct = new Product(req.body);
    try {
        console.log(newProduct);
        const savedProduct = await newProduct.save();
        console.log("WORKED ");
        res.status(200).json(savedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
})

// update
router.put("/:id", verifyTokenAndAdmin, async (req,res) => {
    console.log("prayer");
    try {
        console.log("im here\n", req)
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },
        { new: true});
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
})

// delete
router.delete("/:id", verifyTokenAndAdmin, async (req,res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted");
    } catch (err) {
        res.status(500).json(err);
    }
})

// get product
router.get("/find/:id", async (req,res) => {
    try {
        console.log("prod id: ",req.params.id)
        const product = await Product.findById(req.params.id);
        console.log("prod: ",product);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
})

// get all products
router.get("/", async (req,res) => {
    console.log("FIRST");
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;
        if (qNew) {
            products = await Product.find().sort({createdAt: -1}).limit(5);
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory]
                }
            })
        } else {
            products = await Product.find();
        }
        // console.log("PRODUCTS \n", products);
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;