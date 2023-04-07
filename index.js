const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const db = require("./config/mongooose");
const User = require("./models/userSchema");
const Exercise = require("./models/exerciseSchema");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// @ post route   /api/users
app.post("/api/users", async function (req, res) {
  // let username = req.body.username;
  try {
    let user = await User.findOne(req.body);
    if (user) {
      res.json({
        username: user.username,
        _id: user.id,
      });
    } else {
      let user = await User.create(req.body);
      res.json({
        username: user.username,
        _id: user.id,
      });
    }
  } catch (err) {
    res.json(err);
  }
});

// @ get route   /api/users
app.get("/api/users", async function (req, res) {
  try {
    let users = await User.find();
    if (users) {
      res.json(users);
    }
  } catch (err) {
    res.json(err);
  }
});

// @ post route   /api/users/:_id/exercises
app.post("/api/users/:_id/exercises", async function (req, res) {
  let id = req.params._id;
  let { description, duration, date } = req.body;
  try {
    let user = await User.findById(id);
    if (user) {
      let exerciseObj = new Exercise({
        user_id: user._id,
        description,
        duration,
        date: date ? new Date(date) : new Date(),
      });
      let exercise = await Exercise.create(exerciseObj);
      if (exercise) {
        res.json({
          _id: user._id,
          username: user.username,
          duration: exercise.duration,
          description: exercise.description,
          date: exercise.date.toDateString(),
        });
      }
    } else {
      res.json({
        message: "user not found",
      });
    }
  } catch (err) {
    res.json(err);
  }
});

// @ get route   /api/users/:_id/logs?[from][&to][&limit]
app.get("/api/users/:_id/logs", async function (req, res) {
  let id = req.params["_id"];
  let { from, to, limit } = req.query;
  try {
    let user = await User.findById(id);
    let logs = await Exercise.find({
      user_id: id,
      date: {
        $gte: from,
        $lte: to,
      },
    }).limit(limit);
    let log = [];
    logs.map((exerciseLog) => {
      let { duration, description, date } = exerciseLog;
      log.push({
        description,
        duration,
        date: date.toDateString(),
      });
    });

    res.json({
      username: user.username,
      count: log.length,
      _id: user.id,
      log,
    });
  } catch (error) {
    res.json(error);
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
