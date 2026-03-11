const { Router } = require('express')
const Binomers = require("../models/binomer");
const router = Router()

router.get("/", async (req, res) => {
  try {
    const binomers = await Binomers.find();

    res.status(200).json(binomers);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    let binomers = new Binomers(req.body);
    await binomers.save();

    res.send("Binomers was created successfully");
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/:_id", async (req, res) => {
  try {
    const binomers = await Binomers.findById(req.params._id);
    res.status(200).json(binomers);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.delete("/:_id", async (req, res) => {
  try {
    await Binomers.findByIdAndDelete({ _id: req.params._id });

    res.send(`${req.params._id} Binomer was deleted successfully`);
  } catch (error) {
    console.log({
      error,
      message: "Binomer didnt delete!",
    });
  }
});

module.exports = router;