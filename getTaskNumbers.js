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

router.get("/:userId", isLoggedIn, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ error: "* User doesn't exist" });
    }

    let backlogCount = 0;
    let todoCount = 0;
    let progressCount = 0;
    let doneCount = 0;
    let lowPriorityCount = 0;
    let moderatePriorityCount = 0;
    let highPriorityCount = 0;

    user.tasksArray.map((task) => {
      if (task.phase === "Backlog") backlogCount += 1;
      if (task.phase === "Todo") todoCount += 1;
      if (task.phase === "Progress") progressCount += 1;
      if (task.phase === "Done") doneCount += 1;
      if (task.priority === "LOW PRIORITY") lowPriorityCount += 1;
      if (task.priority === "MODERATE PRIORITY") moderatePriorityCount += 1;
      if (task.priority === "HIGH PRIORITY") highPriorityCount += 1;
    });

    const dueDateTasks = user.tasksArray.filter(
      (task) => task.dueDate && task.phase !== "Done"
    );

    return res.status(200).json({
      backlogCount: backlogCount,
      todoCount: todoCount,
      progressCount: progressCount,
      doneCount: doneCount,
      lowPriorityCount: lowPriorityCount,
      moderatePriorityCount: moderatePriorityCount,
      highPriorityCount: highPriorityCount,
      dueDateTasks: dueDateTasks.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error:
        "Cannot Get Task Numbers . Something went wrong . Please try again after some time",
    });
  }
});

module.exports = router;
