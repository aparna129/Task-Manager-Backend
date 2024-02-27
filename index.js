const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

const registerRoute = require("./register");
const loginRoute = require("./login");
const updateUserInfoRoute = require("./updateUserInfo");
const createTaskRoute = require("./createTask");
const updateTaskPhaseRoute = require("./updateTaskPhase");
const getTaskNumbersRoute = require("./getTaskNumbers");
const getTaskByIdRoute = require("./getTaskById");
const getPhaseWiseTasksRoute = require("./getTasksPhaseWise");
const updateTasksRoute = require("./updateTask");
const deleteTasksRoute = require("./deleteTask");

app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/updateUserInfo", updateUserInfoRoute);
app.use("/createTask", createTaskRoute);
app.use("/updateTaskPhase", updateTaskPhaseRoute);
app.use("/getTaskNumbers", getTaskNumbersRoute);
app.use("/getTaskById", getTaskByIdRoute);
app.use("/getPhaseWiseTasks", getPhaseWiseTasksRoute);
app.use("/updateTasks", updateTasksRoute);
app.use("/deleteTasks", deleteTasksRoute);

app.get("/", (req, res) => {
  res.send("Task Manager App");
});

app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("Database and Server connected successfully"))
    .catch((error) => console.log(error));
});
