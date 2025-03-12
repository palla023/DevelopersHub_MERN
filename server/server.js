const express = require("express");
const mongoose = require("mongoose");
const devuser = require("./devusermodel");
const UserReview = require("./reviewmodel");
const jwt = require("jsonwebtoken");
const middleware = require("./middleware");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
mongoose.set('strictQuery', true)


mongoose
  .connect(
    "mongodb+srv://Developer:Developer@cluster0.scnemhb.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB Connected..."));
mongoose.set('strictQuery', true);
app.post("/register", async (req, res) => {
  const { fullname, email, mobile, skill, password, confirmpassword } =
    req.body;
  try {
    let exist = await devuser.findOne({ email });
    if (exist) {
      return res.status(400).send("User Already Exists!");
    }
    if (password !== confirmpassword) {
      return res.status(400).send("Passwords are not matched...");
    }
    let newUser = new devuser({
      fullname,
      email,
      mobile,
      skill,
      password,
      confirmpassword,
    });
    await newUser.save();
    return res.status(200).send("User Successfully Registered");
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Server Error");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let exist = await devuser.findOne({ email });
    if (!exist) {
      return res.status(400).send("User not Found !");
    }
    if (exist.password !== password) {
      return res.status(400).send("Invalid Credentials...");
    }
    let payload = {
      user: {
        id: exist.id,
      },
    };
    jwt.sign(payload, "jwtsecret", { expiresIn: 30000 }, (err, token) => {
      if (err) throw err;
      return res.json({ token });
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Server Error");
  }
});

app.get("/allprofiles", middleware, async (req, res) => {
  try {
    let allprofiles = await devuser.find();
    return res.json(allprofiles);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Error");
  }
});

app.get("/myprofile", middleware, async (req, res) => {
  try {
    let exist = await devuser.findById(req.user.id);
    if (!exist) {
      return res.status(400).send("User not Found");
    }
    return res.send(exist);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Error");
  }
});

app.post("/addreview", middleware, async (req, res) => {
  try {
    const { taskworker, rating } = req.body;
    let exist = await devuser.findById(req.user.id);
    const newReview = new UserReview({
      taskprovider: exist.fullname,
      taskworker,
      rating,
    });
    await newReview.save();
    return res.status(200).send("New Review Added Successfully ");
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Error");
  }
});

app.get("/myreview", middleware, async (req, res) => {
  try {
    const allReviews = await UserReview.find();
    const myReviews = allReviews.filter(
      (review) => review.taskworker.toString() === req.user.id.toString()
    );
    return res.status(200).json(myReviews);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Error");
  }
});

const path = require('path');
__dirname = path.resolve();
// Serve static files from the React app build folder
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(5000, () => console.log("Server is Running..."));
