const { Router } = require('express')
const Coin = require("../models/coin");
const router = Router()

router.get("/", async (req, res) => {
  try {
    const coins = await Coin.find();

    res.status(200).json(coins);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/", async (req, res) => {
  const { name } = req.body;

  let coin = await Coin.findOne({ name });
  if (coin) return res.send("This coin was already made!");

  coin = new Coin(req.body);
  await coin.save();

  res.send("Coin was created successfully");
});


router.get("/:_id", async (req, res) => {
  try {
    const coin = await Coin.findById(req.params._id);
    res.status(200).json(coin);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;