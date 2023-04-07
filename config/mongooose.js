const mongoose = require("mongoose");
require("dotenv").config();

async function db() {
  // console.log(process.env.MONGO_URI)
  await mongoose.connect(String(process.env.MONGO_URI));
}

db()
  .then(() => console.log(`DataBase is connected`))
  .catch((err) => {
    console.log(err);
  });
module.exports = db;
