const express = require("express");
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost/probity", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
    process.exit(1);
  });

// Define a schema for the user credentials
const userCredentialsSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// Create a model for the user credentials
const UserCredentials = mongoose.model(
  "UserCredentials",
  userCredentialsSchema
);

// Create an Express application
const app = express();

// Enable JSON body parsing
app.use(express.json());

// Define a route for inserting user credentials
app.post("/api/user_credentials", (req, res) => {
  const { username, password } = req.body;

  // Create a new user credentials document
  const newUserCredentials = new UserCredentials({
    username,
    password,
  });

  // Save the document to the database
  newUserCredentials
    .save()
    .then(() => {
      res.status(200).json({ message: "User credentials saved successfully" });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "An error occurred while saving user credentials" });
    });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
