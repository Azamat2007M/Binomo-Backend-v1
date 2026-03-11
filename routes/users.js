const { Router } = require("express");
const router = Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// get
router.get("/", async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json(error.message);
  }
});
// get

//post
router.post("/", async (req, res) => {
  const { name } = req.body;

  let user = await User.findOne({ name });
  if (user) return res.send("User already exists!");

  user = new User(req.body);
  await user.save();

  res.send("User is created: OK");
});
//post

// registration
router.post("/register", upload.single("image"), async (req, res) => {
  try {
    const emailExists = await User.findOne({ email: req.body.email });
    const imagePath = req?.file || req?.file?.path;

    if (!imagePath) {
      return res.status(400).json({ message: "Image is required" });
    }

    if (emailExists) {
      return res.status(400).send("User with this email already exists!");
    }


    bcrypt.hash(req.body.password, 10, async (err, hashedPwd) => {
      if (err) {
        return res.json({
          error: err,
        });
      }

      const user = new User({
        ...req.body,
        password: hashedPwd,
        image: req.file ? req.file.path : null,
      });

      await user.save();

      return res.status(201).json(user);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// registration

// login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Email or Password are incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Email or Password are incorrect" });
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
// login

//delete
router.delete("/:_id", async (req, res) => {
  try {
    await User.findByIdAndDelete({ _id: req.params._id });

    res.send(`${req.params._id} User delete bo'ldi: OK`);
  } catch (error) {
    console.log({
      error,
      message: "User o'chmadi, nimadur noto'g'ri ketgan!",
    });
  }
});
//delete

//get by id
router.get("/:_id", async (req, res) => {
  try {
    const user = await User.findById(req.params._id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error.message);
  }
});
//get by id

//patch
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
      if (existingUser.image && fs.existsSync(existingUser.image)) {
        fs.unlinkSync(existingUser.image);
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
    console.log({
      error,
      message: "Patch ishlamadi, Error!",
    });
    res.status(500).json({ error: error.message });
  }
});
// patch

module.exports = router;
