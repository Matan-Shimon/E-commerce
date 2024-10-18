const Order = require("../models/Order")
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");

const router = require("express").Router();

// create
router.post("/", verifyToken, async (req,res) => {
    console.log("im here!");
    console.log(req.body);
    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        return res.status(200).json(savedOrder);
    } catch (err) {
        return res.status(500).json(err);
    }
})

// update
router.put("/:id", verifyTokenAndAdmin, async (req,res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },
        { new: true});
        return res.status(200).json(updatedOrder);
    } catch (err) {
        return res.status(500).json(err);
    }
})

// delete
router.delete("/:id", verifyTokenAndAdmin, async (req,res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted");
    } catch (err) {
        res.status(500).json(err);
    }
})

// get monthly income
router.get("/income", verifyTokenAndAdmin, async (req,res) => {
    console.log("income has been entered!")
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth()-1));
    console.log("NO PROBLEM")
    try {
        const income = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: previousMonth
                    },
                }
            },
            {
                $project: {
                    month: {
                        $month: "$createdAt"
                    },
                    sales: "$amount"
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: {
                        $sum: "$sales"
                    }
                }
            }
        ])
        console.log("INCOME \n", income);
        return res.status(200).json(income);
    } catch(err) {
        console.error("Error fetching income data:", err);
        res.status(500).json(err);
    }
})

// Get monthly count of a specific product
router.get("/product-count-per-month", verifyTokenAndAdmin, async (req, res) => {
    const prodId = req.query.pid; // Get the product ID from query parameters
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const productCount = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: previousMonth // Only consider orders from the last two months
                    },
                    ...(prodId && {
                        products: { $elemMatch: { productId: prodId } }, // Filter by product ID if provided
                    })
                }
            },
            {
                $unwind: "$products" // Deconstruct the products array
            },
            {
                $match: {
                    "products.productId": prodId // Ensure the productId matches
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" }, // Group by month
                    totalQuantity: { $sum: "$products.quantity" } // Sum the quantities of the product
                }
            },
            {
                $project: {
                    month: "$_id", // Include month in the output
                    totalQuantity: 1 // Keep total quantity in the output
                }
            }
        ]);

        console.log("PRODUCT COUNT \n", productCount);
        res.status(200).json(productCount); // Send the result as response
    } catch (err) {
        res.status(500).json(err); // Handle errors
    }
});

// Get total count of a specific product
router.get("/product-count", verifyTokenAndAdmin, async (req, res) => {
    const prodId = req.query.pid; // Get the product ID from query parameters
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const totalQuantity = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: previousMonth // Only consider orders from the last two months
                    },
                    ...(prodId && {
                        products: { $elemMatch: { productId: prodId } }, // Filter by product ID if provided
                    })
                }
            },
            {
                $unwind: "$products" // Deconstruct the products array
            },
            {
                $match: {
                    "products.productId": prodId // Ensure the productId matches
                }
            },
            {
                $group: {
                    _id: null, // Group all documents together
                    totalQuantity: { $sum: "$products.quantity" } // Sum the quantities of the product
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the _id from the output
                    totalQuantity: 1 // Keep total quantity in the output
                }
            }
        ]);

        console.log("TOTAL PRODUCT COUNT \n", totalQuantity);
        res.status(200).json(totalQuantity.length > 0 ? totalQuantity[0] : { totalQuantity: 0 }); // Send the result as response
    } catch (err) {
        res.status(500).json(err); // Handle errors
    }
});

// get specific order
router.get("/:orderId", verifyToken, async (req,res) => {
    try {
        //console.log("HI THERE")
        //console.log(req.params.orderId);
        const order = await Order.find({_id: req.params.orderId})
        //console.log(order)
        return res.status(200).json(order[0]);
    } catch (err) {
        return res.status(500).json(err);
    }
})

// get user orders
router.get("/find/:userId", verifyToken, async (req,res) => {
    try {
        console.log("id: ",req.params.userId);
        const orders = await Order.find({userId: req.params.userId})
        console.log("ORDERS\n",orders);
        return res.status(200).json(orders);
    } catch (err) {
        return res.status(500).json(err);
    }
})

// get all orders
router.get("/", verifyTokenAndAdmin, async (req,res) => {
    console.log("IM TRING TO FETCH ORDERS")
    try {
        const orders = await Order.find();
        console.log("ORDERS \n", orders);
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;