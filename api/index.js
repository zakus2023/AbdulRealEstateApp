import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import jwt from "jsonwebtoken";

import User from "./models/user.model.js";
import bcrypt from "bcrypt";
import { errorHandler } from "./utils/error.js";
import cookieParser from "cookie-parser";

import { verifyToken } from "./utils/verifyUser.js";
import { access } from "fs";
import Listing from "./models/listing.model.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to Mongodb");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(3000, () => {
  console.log("Listening");
});

// ----------------------------------------------------------------------------------------------------------------------------------

// test api

app.get("/test", (req, res) => {
  res.send("Inside");
});

// signup api

app.post("/api/signup", async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(200).json("User Created");
  } catch (error) {
    // res.status(500).json(error.message)
    next(error); //this is from the err handling middleware
  }
});

// signin api

app.post("/api/signin", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(401, "User not found"));
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(400, "Wrong credentials"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
});

//Google click api
app.post("/api/google", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
});

// update user api

app.post("/api/update/:id", verifyToken, async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You cannot update this profile"));

  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
});

//delete user api

app.delete("/api/delete/:id", verifyToken, async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(403, "Unauthorized"));

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
});

//sigout api

app.get("/api/signout", (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("You signed out successfully");
  } catch (error) {
    next(error);
  }
});

//Listing creation api
app.post("/api/listing", async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
});

// ----------------------------------------------------------------------------------------------------------------------------------
// Error handling api middleware

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ----------------------------------------------------------------------------------------------------------------------------------
