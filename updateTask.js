const express = require("express");
const mongoose = require("mongoose");
const User = require("./userModel");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.use(cors());

router.use(express.json());

router.get("/", (req, res) => {
  res.send("Update Task Page");
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
    const { name, priority, checklistArray, dueDate } = req.body;

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

    if (!name) {
      return res.status(400).json({ error: "* Task Name is required" });
    }

    const existingTask = user.tasksArray.find(
      (task, index) => task.name === name && index !== taskIndex
    );
    if (existingTask) {
      return res.status(400).json({ error: "* Task name already exists" });
    }

    if (!priority) {
      return res.status(400).json({ error: "* Select priority of your task" });
    }

    if (checklistArray.length < 1) {
      return res.status(400).json({ error: "* Minimum 1 checklist required" });
    }

    user.tasksArray[taskIndex].name = name;
    user.tasksArray[taskIndex].priority = priority;
    user.tasksArray[taskIndex].checklistArray = checklistArray;
    if (dueDate) {
      user.tasksArray[taskIndex].dueDate = dueDate;
    }

    await user.save();

    return res.status(200).json({
      message: "Task edited successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error:
        "Cannot update task . Something went wrong. Please try again after some time",
    });
  }
});

module.exports = router;
