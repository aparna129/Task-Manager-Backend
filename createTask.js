const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./userModel");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.use(cors());

router.use(express.json());

router.get("/", (req, res) => {
  res.send("Task Creation Page");
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

router.post("/:userId", isLoggedIn, async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, priority, checklistArray, dueDate } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ error: "* User doesn't exist" });
    }

    if (!name) {
      return res.status(400).json({ error: "* Task Name is required" });
    }

    if (user.tasksArray.some((task) => task.name === name)) {
      return res.status(400).json({ error: "* Task already exists" });
    }

    if (!priority) {
      return res.status(400).json({ error: "* Select priority of your task" });
    }

    if (checklistArray.length < 1) {
      return res.status(400).json({ error: "* Minimum 1 checklist required" });
    }

    const task = {
      name: name,
      priority: priority,
      checklistArray: checklistArray,
      dueDate: dueDate,
    };

    user.tasksArray.push(task);

    await user.save();

    return res
      .status(200)
      .json({ message: "Task created successfully", data: user.tasksArray });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error:
        "Task cannot be created . Something went wrong . Please try again after some time",
    });
  }
});

module.exports = router;
