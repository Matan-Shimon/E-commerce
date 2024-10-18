const router = require("express").Router();

router.post("/payment", async (req, res) => {
  const stripe = require("stripe")(process.env.STRIPE_KEY);
  console.log("I'm here");
  console.log(process.env.STRIPE_KEY);
  try {
    console.log("inside");
    const charge = await stripe.charges.create({
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    });
    res.status(200).json(charge);
  } catch (stripeErr) {
    console.error("Stripe Error:", stripeErr);
    res.status(500).json({
      message: "Payment processing error",
      error: stripeErr,
    });
  }
});

module.exports = router;
