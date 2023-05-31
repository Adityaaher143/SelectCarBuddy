const express = require("express");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/probity")
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log(error);
    process.exit(1);
  });

const userDetailSchema = new mongoose.Schema({
  student_name: {
    type: String,
    required: true,
  },
  roll_no: {
    type: Number,
    required: true,
    unique: true,
  },
});

const StudentDetail = mongoose.model("studentsData", userDetailSchema);

const app = express();

app.use(express.json());

app.use(express.bodyParser.json());

app.post("/api/students", (req, res) => {
  const { student_name, roll_no } = req.body;

  StudentDetail.findOne({
    $and: [{ student_name: student_name }, { roll_no: roll_no }],
  }).then((existingUser) => {
    if (existingUser) {
      res.status(409).json({ erro: "student or roll number already exists" });
    } else {
      const newStudentDetails = new StudentDetail({
        student_name,
        roll_no,
      });

      newStudentDetails
        .save()
        .then(() => {
          res.status(200).json({
            message: "student successfully registerd",
          });
        })
        .catch((error) => {
          res.status(500).json({
            error: "error occured",
          });
          console.log(error);
        })
        .catch((error) => {
          res.status(500).json({
            error: "an error occured",
          });
        });
    }
  });
});
