const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./userModel");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.use(cors());

router.use(express.json());

router.get("/", (req, res) => {
  res.send("Update User Details Page");
});

const isLoggedIn = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (authorization) {
      const token = authorization.split(" ")[1];
      const user = jwt.verify(token, process.env.JWT_SECRETKEY);
      if (user) {
        next();
        return;
      }
    } else {
      return res
        .status(400)
        .json({ error: "* Token invalid or expired , Please login again" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ error: "* Token invalid or expired , Please login again" });
  }
};

router.patch("/:userId", isLoggedIn, async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, oldPwd, newPwd } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ error: "* User doesn't exist" });
    }

    if (!username) {
      return res.status(400).json({ error: "* Enter your new name" });
    }

    if (oldPwd && !newPwd) {
      return res.status(400).json({ error: "* Enter your new Password" });
    }

    if (oldPwd) {
      const passwordMatched = await bcrypt.compare(oldPwd, user.password);

      if (!passwordMatched) {
        return res.status(400).json({ error: "* Incorrect Old Password" });
      }

      if (newPwd.length < 6) {
        return res
          .status(400)
          .json({ error: "* Weak password,minimum length should be 6" });
      }

      const encryptedPassword = await bcrypt.hash(newPwd, 10);
      user.password = encryptedPassword;
    }

    user.username = username;

    await user.save();

    return res
      .status(200)
      .json({
        message: "User details updated successfully",
        name: user.username,
      });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error:
        "Cannot update user details . Something went wrong . Please try again after some time",
    });
  }
});


module.exports = router;
