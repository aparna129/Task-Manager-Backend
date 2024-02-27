const express = require("express");
const mongoose = require("mongoose");
const User = require("./userModel");
const cors = require("cors");

const router = express.Router();

router.use(cors());

router.use(express.json());

router.get("/", (req, res) => {
  res.send("Get Task Page");
});

router.get("/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;

    let foundTask = null;

    const allUsers = await User.find();

    allUsers.some((user) => {
      const task = user.tasksArray.find(
        (task) => task._id.toString() === taskId
      );
      if (task) {
        foundTask = task;
        return true;
      }
    });

    let checklistDoneCount = 0;

    foundTask.checklistArray.map((checklist) => {
      if (checklist.checked === true) checklistDoneCount += 1;
    });

    if (foundTask) {
      return res
        .status(200)
        .json({ task: foundTask, checklistDoneCount: checklistDoneCount });
    } else {
      return res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error:
        "Cannot get Task . Something went wrong . Please try again after some time",
    });
  }
});

module.exports = router;
