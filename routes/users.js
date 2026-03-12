const { Router } = require("express");
const router = Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const upload = require("../middleware/multer");
const cloudinary = require("../config/cloudinary");

// get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// create user
router.post("/", async (req, res) => {
  const { name } = req.body;

  let user = await User.findOne({ name });
  if (user) return res.send("User already exists!");

  user = new User(req.body);
  await user.save();

  res.send("User is created: OK");
});

// registration
router.post("/register", upload.single("image"), async (req, res) => {
  try {
    const emailExists = await User.findOne({ email: req.body.email });

    if (emailExists) {
      return res.status(400).send("User with this email already exists!");
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const hashedPwd = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      ...req.body,
      password: hashedPwd,
      image: req.file.path,
    });

    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Email or Password are incorrect",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Email or Password are incorrect",
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// delete user
router.delete("/:_id", async (req, res) => {
  try {
    const user = await User.findById(req.params._id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (user.image) {
      const publicId = user.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`binomo_users/${publicId}`);
    }

    await User.findByIdAndDelete(req.params._id);

    res.send(`${req.params._id} User deleted: OK`);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "User deletion failed",
    });
  }
});

// get by id
router.get("/:_id", async (req, res) => {
  try {
    const user = await User.findById(req.params._id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// update user
router.patch("/:_id", upload.single("image"), async (req, res) => {
  try {
    const _id = req.params._id;

    const existingUser = await User.findById(_id);

    if (!existingUser) {
      return res.status(404).send("User topilmadi");
    }

    let updatedData = {
      ...req.body,
    };

    if (req.file) {
      if (existingUser.image) {
        const publicId = existingUser.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`binomo_users/${publicId}`);
      }

      updatedData.image = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      updatedData,
      { new: true }
    );

    res.status(200).json(updatedUser);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Patch ishlamadi",
    });
  }
});

module.exports = router;