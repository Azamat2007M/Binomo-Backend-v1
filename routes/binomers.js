const { Router } = require('express');
const Binomers = require("../models/binomer");
const router = Router();

router.get("/", async (req, res) => {
  try {
    const binomers = await Binomers.findAll();
    res.status(200).json(binomers);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    await Binomers.create(req.body);

    res.send("Binomers was created successfully");
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const binomers = await Binomers.findByPk(req.params.id);
    if (!binomers) return res.status(404).send("Binomer not found");
    
    res.status(200).json(binomers);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    
    const deleted = await Binomers.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).send("Binomer not found");
    }

    res.send(`${id} Binomer was deleted successfully`);
  } catch (error) {
    console.log({
      error: error.message,
      message: "Binomer didn't delete!",
    });
    res.status(500).json({ message: "Binomer didn't delete!" });
  }
});

module.exports = router;