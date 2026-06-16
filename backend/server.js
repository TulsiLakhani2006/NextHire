const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect(
  "mongodb+srv://nexthireuser:nexthire%400506@cluster0.pli9hxn.mongodb.net/nexthire?retryWrites=true&w=majority"
)
.then(() => {
  console.log("MongoDB Connected");
})
.catch((err) => {
  console.error("MongoDB Error:", err);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});