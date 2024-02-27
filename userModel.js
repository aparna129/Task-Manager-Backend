const mongoose = require("mongoose");

const Taskuser = mongoose.model("taskuser", {
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tasksArray: [
    {
      name: {
        type: String,
        required: true,
      },
      priority: {
        type: String,
        enum: ["LOW PRIORITY", "MODERATE PRIORITY", "HIGH PRIORITY"],
        required: true,
      },
      phase: {
        type: String,
        enum: ["Backlog", "Todo", "Progress", "Done"],
        default: "Todo",
      },
      createdAt: {
        type: Date,
        default: Date.now(),
        required: true,
      },
      dueDate: {
        type: Date,
      },
      expandCollapse: {
        type: String,
        enum: ["expand", "collapse"],
      },
      checklistArray: [
        {
          checked: {
            type: Boolean,
          },
          value: {
            type: String,
          },
        },
      ],
    },
  ],
});

module.exports = Taskuser;
