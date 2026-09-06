// Synchronized with server/server.js
const express = require("express");
const mongoose = require("mongoose");
const devuser = require("./server/devusermodel");
const UserReview = require("./server/reviewmodel");
const Post = require("./server/postmodel");
const jwt = require("jsonwebtoken");
const middleware = require("./server/middleware");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

mongoose.set("strictQuery", true);
mongoose
  .connect(
    "mongodb+srv://Developer:Developer@cluster0.scnemhb.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB Connected..."))
  .catch((err) => console.error("DB Connection Error:", err.message));

// ==================== AUTH & USER ROUTES ====================

// Register
app.post("/register", async (req, res) => {
  const {
    fullname,
    email,
    mobile,
    skill,
    bio,
    experience,
    github,
    linkedin,
    avatar,
    password,
    confirmpassword,
  } = req.body;

  try {
    if (!fullname || !email || !mobile || !skill || !password || !confirmpassword) {
      return res.status(400).send("Please fill in all required fields.");
    }

    let exist = await devuser.findOne({ email });
    if (exist) {
      return res.status(400).send("User Already Exists!");
    }
    if (password !== confirmpassword) {
      return res.status(400).send("Passwords do not match...");
    }

    let newUser = new devuser({
      fullname,
      email,
      mobile,
      skill,
      bio: bio || "",
      experience: experience || "Full Stack Developer",
      github: github || "",
      linkedin: linkedin || "",
      avatar: avatar || "",
      password,
      confirmpassword,
    });
    await newUser.save();
    return res.status(200).send("User Successfully Registered");
  } catch (err) {
    console.error("Register error:", err.message);
    return res.status(500).send("Internal Server Error");
  }
});

// Login
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
    jwt.sign(payload, "jwtsecret", { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      return res.json({
        token,
        user: {
          id: exist._id,
          fullname: exist.fullname,
          email: exist.email,
          skill: exist.skill,
          avatar: exist.avatar,
        },
      });
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).send("Internal Server Error");
  }
});

// Get all profiles (Read)
app.get("/allprofiles", middleware, async (req, res) => {
  try {
    let allprofiles = await devuser.find().select("-password -confirmpassword");
    return res.json(allprofiles);
  } catch (err) {
    console.error("Allprofiles error:", err.message);
    return res.status(500).send("Internal Error");
  }
});

// Get My Profile (Read)
app.get("/myprofile", middleware, async (req, res) => {
  try {
    let exist = await devuser.findById(req.user.id).select("-password -confirmpassword");
    if (!exist) {
      return res.status(400).send("User not Found");
    }
    return res.json(exist);
  } catch (err) {
    console.error("Myprofile error:", err.message);
    return res.status(500).send("Internal Error");
  }
});

// Update My Profile (Update)
app.put("/myprofile", middleware, async (req, res) => {
  try {
    const { fullname, mobile, skill, bio, experience, github, linkedin, avatar } = req.body;
    let user = await devuser.findById(req.user.id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (fullname) user.fullname = fullname;
    if (mobile) user.mobile = mobile;
    if (skill) user.skill = skill;
    if (bio !== undefined) user.bio = bio;
    if (experience) user.experience = experience;
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();
    return res.json(user);
  } catch (err) {
    console.error("Update profile error:", err.message);
    return res.status(500).send("Internal Error");
  }
});

// Delete My Account (Delete)
app.delete("/myprofile", middleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await devuser.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    await UserReview.deleteMany({
      $or: [{ taskworker: userId }, { taskworker: user.fullname }, { taskproviderId: userId }],
    });
    await Post.deleteMany({ user: userId });
    await devuser.findByIdAndDelete(userId);

    return res.send("Account and related data successfully deleted");
  } catch (err) {
    console.error("Delete profile error:", err.message);
    return res.status(500).send("Internal Error");
  }
});

// Get Individual Profile by ID (Read)
app.get("/userprofile/:id", middleware, async (req, res) => {
  try {
    let profile = await devuser.findById(req.params.id).select("-password -confirmpassword");
    if (!profile) {
      return res.status(404).send("Developer profile not found");
    }
    return res.json(profile);
  } catch (err) {
    console.error("Userprofile error:", err.message);
    return res.status(500).send("Internal Error");
  }
});

// ==================== REVIEWS ROUTES ====================

// Add Review (Create)
app.post("/addreview", middleware, async (req, res) => {
  try {
    const { taskworker, rating, comment } = req.body;
    if (!taskworker || !rating) {
      return res.status(400).send("Task worker and rating are required");
    }

    let exist = await devuser.findById(req.user.id);
    const newReview = new UserReview({
      taskprovider: exist.fullname,
      taskproviderId: exist._id.toString(),
      taskworker,
      rating: rating.toString(),
      comment: comment || "",
    });
    await newReview.save();
    return res.status(200).send("New Review Added Successfully");
  } catch (err) {
    console.error("Add review error:", err.message);
    return res.status(500).send("Internal Error");
  }
});

// Get My Reviews (Read)
app.get("/myreview", middleware, async (req, res) => {
  try {
    const user = await devuser.findById(req.user.id);
    const allReviews = await UserReview.find().sort({ createdAt: -1 });
    const myReviews = allReviews.filter(
      (review) =>
        (review.taskworker && review.taskworker.toString() === req.user.id.toString()) ||
        (user && review.taskworker === user.fullname)
    );
    return res.status(200).json(myReviews);
  } catch (err) {
    console.error("Myreview error:", err.message);
    return res.status(500).send("Internal Error");
  }
});

// Get Reviews for a specific user (Read)
app.get("/userreviews/:id", middleware, async (req, res) => {
  try {
    const targetUser = await devuser.findById(req.params.id);
    const allReviews = await UserReview.find().sort({ createdAt: -1 });
    const userReviews = allReviews.filter(
      (review) =>
        (review.taskworker && review.taskworker.toString() === req.params.id.toString()) ||
        (targetUser && review.taskworker === targetUser.fullname)
    );
    return res.status(200).json(userReviews);
  } catch (err) {
    console.error("User reviews error:", err.message);
    return res.status(500).send("Internal Error");
  }
});

// Update Review (Update)
app.put("/review/:id", middleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    let review = await UserReview.findById(req.params.id);
    if (!review) {
      return res.status(404).send("Review not found");
    }

    const user = await devuser.findById(req.user.id);
    const isOwner =
      review.taskproviderId === req.user.id.toString() ||
      (user && review.taskprovider === user.fullname);

    if (!isOwner) {
      return res.status(403).send("You can only edit your own reviews");
    }

    if (rating) review.rating = rating.toString();
    if (comment !== undefined) review.comment = comment;

    await review.save();
    return res.json(review);
  } catch (err) {
    console.error("Edit review error:", err.message);
    return res.status(500).send("Internal Error");
  }
});

// Delete Review (Delete)
app.delete("/review/:id", middleware, async (req, res) => {
  try {
    let review = await UserReview.findById(req.params.id);
    if (!review) {
      return res.status(404).send("Review not found");
    }

    const user = await devuser.findById(req.user.id);
    const canDelete =
      review.taskproviderId === req.user.id.toString() ||
      (user && review.taskprovider === user.fullname) ||
      review.taskworker.toString() === req.user.id.toString() ||
      (user && review.taskworker === user.fullname);

    if (!canDelete) {
      return res.status(403).send("Not authorized to delete this review");
    }

    await UserReview.findByIdAndDelete(req.params.id);
    return res.send("Review deleted successfully");
  } catch (err) {
    console.error("Delete review error:", err.message);
    return res.status(500).send("Internal Error");
  }
});

// ==================== COMMUNITY POSTS / PROJECTS ROUTES ====================

// Add Post / Project (Create)
app.post("/addpost", middleware, async (req, res) => {
  try {
    const { title, content, tags, link } = req.body;
    if (!title || !content) {
      return res.status(400).send("Title and description are required");
    }

    let user = await devuser.findById(req.user.id);
    const newPost = new Post({
      user: req.user.id,
      fullname: user.fullname,
      avatar: user.avatar || "",
      title,
      content,
      tags: tags || "General",
      link: link || "",
    });

    await newPost.save();
    return res.status(201).json(newPost);
  } catch (err) {
    console.error("Add post error:", err.message);
    return res.status(500).send("Internal Error");
  }
});

// Get All Posts (Read)
app.get("/allposts", middleware, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    return res.json(posts);
  } catch (err) {
    console.error("All posts error:", err.message);
    return res.status(500).send("Internal Error");
  }
});

// Like / Unlike Post (Update)
app.put("/post/like/:id", middleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post not found");
    }

    const alreadyLiked = post.likes.some(
      (like) => like.user.toString() === req.user.id.toString()
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (like) => like.user.toString() !== req.user.id.toString()
      );
    } else {
      post.likes.unshift({ user: req.user.id });
    }

    await post.save();
    return res.json(post.likes);
  } catch (err) {
    console.error("Like post error:", err.message);
    return res.status(500).send("Internal Error");
  }
});

// Delete Post (Delete)
app.delete("/post/:id", middleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post not found");
    }

    if (post.user.toString() !== req.user.id.toString()) {
      return res.status(403).send("Not authorized to delete this post");
    }

    await Post.findByIdAndDelete(req.params.id);
    return res.send("Post removed successfully");
  } catch (err) {
    console.error("Delete post error:", err.message);
    return res.status(500).send("Internal Error");
  }
});

// ==================== STATIC CLIENT SERVING ====================

const clientBuildPath = fs.existsSync(path.resolve(__dirname, "client/build"))
  ? path.resolve(__dirname, "client/build")
  : path.resolve(__dirname, "../client/build");

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

// ==================== SERVER STARTUP ====================

const DEFAULT_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

function startServer(port) {
  const server = app
    .listen(port, () => {
      console.log(`Server is Running on port ${port}...`);
    })
    .on("error", (err) => {
      if (err.code === "EADDRINUSE" && !process.env.PORT) {
        const nextPort = port === 5000 ? 5001 : port + 1;
        console.log(
          `Port ${port} is in use (often macOS AirPlay Receiver on 5000). Falling back to port ${nextPort}...`
        );
        startServer(nextPort);
      } else {
        console.error("Server error:", err);
      }
    });
}

startServer(DEFAULT_PORT);
