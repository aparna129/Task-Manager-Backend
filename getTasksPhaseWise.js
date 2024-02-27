const express = require("express");
const mongoose = require("mongoose");
const User = require("./userModel");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.use(cors());

router.use(express.json());

router.get("/", (req, res) => {
  res.send("Get Task Numbers Page");
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
    const { selectedOption } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ error: "* User doesn't exist" });
    }

    let startDate;
    let endDate = new Date();

    switch (selectedOption) {
      case "This Week":
        startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "Today":
        startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 1);
        break;
      case "This Month":
        startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 30);
        break;
      default:
        break;
    }

    const backlogTasks = user.tasksArray.filter(
      (task) =>
        task.phase === "Backlog" &&
        new Date(task.createdAt) >= startDate &&
        new Date(task.createdAt) <= endDate
    );

    const todoTasks = user.tasksArray.filter(
      (task) =>
        task.phase === "Todo" &&
        new Date(task.createdAt) >= startDate &&
        new Date(task.createdAt) <= endDate
    );

    const progressTasks = user.tasksArray.filter(
      (task) =>
        task.phase === "Progress" &&
        new Date(task.createdAt) >= startDate &&
        new Date(task.createdAt) <= endDate
    );

    const doneTasks = user.tasksArray.filter(
      (task) =>
        task.phase === "Done" &&
        new Date(task.createdAt) >= startDate &&
        new Date(task.createdAt) <= endDate
    );

    return res.status(200).json({
      backlogTasks: backlogTasks,
      todoTasks: todoTasks,
      progressTasks: progressTasks,
      doneTasks: doneTasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error:
        "Cannot Get Tasks . Something went wrong . Please try again after some time",
    });
  }
});

module.exports = router;
