const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const cors = require("cors");
const { extend } = require("lodash");
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

router.use(cors());

router
  .route("/")
  .get(async (req, res) => {
    const users = await User.find({}).populate("likedVideos");
    res.json({ success: true, message: "sending user data", users });
  })
  .post(async (req, res) => {
    try {
      console.log("hit post for new user creation");
      const userBody = req.body;
      const newUser = new User(userBody);
      const newData = await newUser.save();

      console.log({ userBody });

      console.log({ newUser });
      console.log({ newData });

      res.json({ success: true, message: "User Created", newData });
    } catch (error) {
      res.json({
        success: false,
        message: "User Creattion Failed",
        errorMessage: error.message,
      });
    }
  });

router.param("userId", async (req, res, next, userId) => {
  try {
    const user = await User.findById(userId).populate("likedVideos");
    console.log({ user });
    if (!user) {
      res.json({ success: false, message: "user not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.json({
      success: false,
      message: "error occured",
      errorMessage: error.message,
    });
  }
});

// ---- likedvideos
router
  .route("/likedvideos/:userId")
  .get((req, res) => {
    const user1 = req.user;

    console.log({ user1 });
    res.json({
      success: true,
      user: user1,
    });
  })
  .post(async (req, res) => {
    try {
      const user = req.user;
      const { videoId } = req.body;
      console.log({ user });
      console.log(videoId);

      const addedUser = await user.likedVideos.addToSet(videoId);
      console.log({ addedUser });
      console.log({ user });
      await user.save();

      // const updatedUserData = {
      //   likedVideos: [...user.likedVideos, ...userUpdate.likedVideos],
      // };
      // console.log(updatedUserData);

      // const finalUserUpdate = extend(user, updatedUserData);
      // console.log({ finalUserUpdate });
      // const updatedResponse = await finalUserUpdate.save();

      res.json({ success: true, message: "Video Added to Watch Later" });
    } catch (error) {
      res.json({
        success: false,
        message: "failed to like item",
        errorMessage: error.message,
      });
    }
  });

router.route("/likedvideos/:userId/:videoId").delete(async (req, res) => {
  const userToBeUpdated = req.user;
  const { videoId } = req.params;
  console.log({ userToBeUpdated });
  console.log(videoId);
  await userToBeUpdated.likedVideos.pull({
    _id: videoId,
  });
  await userToBeUpdated.save();

  res.json({
    success: true,
    message: "video removed from watch later",
  });
});

// ---------------auth

router
  .route("/auth")
  .get(async (req, res) => {
    const param = req.params;
    console.log({ param });

    res.json({ success: true });
  })

  .post(async (req, res) => {
    console.log("entere post auth");
    const credentialsBody = req.body;
    const requestedUser = await User.findOne({ name: credentialsBody.name })
      .populate("likedVideos")
      .populate("playLists.videos");
    console.log({ credentialsBody });
    console.log({ requestedUser });

    const rname = requestedUser.name;
    const cname = credentialsBody.name;
    const rpass = requestedUser.password;
    const cpass = credentialsBody.password;

    console.log({ rname });
    console.log({ cname });
    console.log({ rpass });
    console.log({ cpass });

    if (
      requestedUser.name === credentialsBody.name &&
      requestedUser.password === credentialsBody.password
    ) {
      requestedUser.password = undefined;
      res.json({
        success: true,
        message: "Authentication Successfull",
        login: true,
        requestedUser,
      });
    } else {
      res.json({
        success: false,
        message: "authentication failed",
        login: false,
      });
    }
  });

// authId
router.route("/auth/:authId").get(async (req, res) => {
  const { authId } = req.params;

  const user = await User.findById(authId)
    .populate("likedVideos")
    .populate("playLists.videos");
  user.password = undefined;
  console.log({ user });
  res.json({ success: true, user });
});

module.exports = router;
