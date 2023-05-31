// Required packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// MongoDB connection
const dbUri =
  "mongodb+srv://probitypic:probity2022@selectcarbuddy.al4dkau.mongodb.net/SCB";
mongoose
  .connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// MongoDB schema
const userSchema = new mongoose.Schema({
  phone_number: String,
  password: String,
  token: String,
});
const User = mongoose.model("user_credentials", userSchema);

// Express setup
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Login API endpoint
app.post("/api/login", async (req, res) => {
  const { phone_number, password } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ phone_number });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password matches
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Return the token
    const token = user.token;
    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Start the server
app.listen(80, () => {
  console.log("Server started on port 443");
});
