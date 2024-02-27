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
  res.send("Update Task Phase Page");
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

router.patch("/:userId/:taskId", isLoggedIn, async (req, res) => {
  try {
    const { userId, taskId } = req.params;
    const { phase } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ error: "* User doesn't exist" });
    }

    const taskIndex = user.tasksArray.findIndex(
      (task) => task._id.toString() === taskId
    );

    if (taskIndex === -1) {
      return res.status(400).json({ error: "* Task doesn't exist" });
    }

    const task = user.tasksArray.splice(taskIndex, 1)[0];

    task.phase = phase;

    user.tasksArray.push(task);

    await user.save();

    return res.status(200).json({
      message: "Task Phase updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error:
        "Cannot update task phase. Something went wrong. Please try again after some time",
    });
  }
});

module.exports = router;
