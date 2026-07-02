const { Router } = require('express');
const Coin = require("../models/coin");
const router = Router();

router.get("/", async (req, res) => {
  try {
    const coins = await Coin.findAll();
    res.status(200).json(coins);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    let coin = await Coin.findOne({ where: { name } });
    if (coin) return res.send("This coin was already made!");

    await Coin.create(req.body);

    res.send("Coin was created successfully");
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const coin = await Coin.findByPk(req.params.id);
    if (!coin) return res.status(404).send("Coin not found");

    res.status(200).json(coin);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;