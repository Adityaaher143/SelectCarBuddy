const express = require("express");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://probitypic:probity2022@selectcarbuddy.al4dkau.mongodb.net/SCB",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
    process.exit(1);
  });

// Define a schema for the user credentials
const userCredentialsSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  shop_name: {
    type: String,
    required: true,
  },
  shop_address: {
    type: String,
    required: true,
  },
  shop_category: {
    type: String,
    required: true,
  },
  Adhar_Number: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
    default: uuidv4(),
  },
});

// Create a model for the user credentials
const UserCredentials = mongoose.model(
  "user_credentials",
  userCredentialsSchema
);

// Create an Express application
const app = express();

// Enable JSON body parsing
app.use(express.json());

// Define a route for inserting user credentials
app.post("/api/user_credentials", (req, res) => {
  const {
    username,
    password,
    name,
    phone_number,
    email,
    shop_name,
    shop_address,
    shop_category,
    Adhar_Number,
  } = req.body;

  // Check if a user with the same username or email already exists
  UserCredentials.findOne({
    $or: [{ username: username }, { email: email }],
  })
    .then((existingUser) => {
      if (existingUser) {
        res.status(409).json({ error: "Username or email already exists" });
      } else {
        // Create a new user credentials document
        const newUserCredentials = new UserCredentials({
          username,
          password,
          name,
          phone_number,
          email,
          shop_name,
          shop_address,
          shop_category,
          Adhar_Number,
        });

        // Save the document to the database
        newUserCredentials
          .save()
          .then(() => {
            res.status(200).json({
              message: "User credentials saved successfully",
              token: newUserCredentials.token,
            });
          })
          .catch((error) => {
            res.status(500).json({
              error: "An error occurred while saving user credentials",
            });
            console.log(error);
          });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "An error occurred while checking user existence" });
    });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
