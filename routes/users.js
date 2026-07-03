const { Router } = require("express");
const router = Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const upload = require("../middleware/multer");
const cloudinary = require("../config/cloudinary");

router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    const userExists = await User.findOne({ where: { name } });
    if (userExists) return res.send("User already exists!");

    const user = await User.create(req.body);

    res.send("User is created: OK");
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/register", (req, res, next) => {
  upload.single("image")(req, res, function (err) {
    if (err) {
      console.error("Multer/Cloudinary error:", err);
      return res.status(400).send(`File upload error: ${err.message || err}`);
    }
    next();
  });
}, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and Password are required!");
    }

    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      return res.status(400).send("User with this email already exists!");
    }

    if (!req.file) {
      return res.status(400).send("Image is required!");
    }

    const hashedPwd = await bcrypt.hash(password, 10);

    const user = await User.create({
      ...req.body,
      password: hashedPwd,
      image: req.file.path,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Registration database error:", error);
    res.status(500).send(error.message || "Internal Server Error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

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
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id); 

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (user.image) {
      const publicId = user.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`binomo_users/${publicId}`);
    }

    await User.destroy({ where: { id } });

    res.send(`${id} User deleted: OK`);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "User deletion failed",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.patch("/:id", upload.single("image"), async (req, res) => {
  try {
    const id = req.params.id;

    const existingUser = await User.findByPk(id);

    if (!existingUser) {
      return res.status(404).send("User not found");
    }

    let updatedData = {
      ...req.body,
    };
    if (req.file) {
      if (existingUser.image && typeof existingUser.image === 'string') {
        const parts = existingUser.image.split("/");
        if (parts.length > 0) {
          const publicId = parts.pop().split(".")[0];
          await cloudinary.uploader.destroy(`binomo_users/${publicId}`);
        }
      }

      updatedData.image = req.file.path;
    }

    await User.update(updatedData, { where: { id } });

    const updatedUser = await User.findByPk(id);

    res.status(200).json(updatedUser);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Patch user failed",
    });
  }
});

module.exports = router;