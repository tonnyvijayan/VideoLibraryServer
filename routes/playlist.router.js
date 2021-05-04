const express = require("express");
const router = express.Router();
const cors = require("cors");
const User = require("../models/user.model");
const { extend } = require("lodash");

router.use(cors());

router.route("/").get((req, res) => {
  res.send({ success: true, message: "from playlist" });
});

router.param("userId", async (req, res, next, userId) => {
  try {
    const user = await User.findById(userId).populate("playLists.videos");
    if (!user) {
      res.status(400).json({ success: false, message: "user not found" });
    }
    // console.log({ user });
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "error finding user",
      errorMessage: error.message,
    });
  }
});

router
  .route("/:userId")
  .get(async (req, res) => {
    const getUser = req.user;

    res.json({ success: true, message: "sending id", getUser });
  })

  .post(async (req, res) => {
    console.log({ req });
    const userToUpdate = req.user;
    const { playListName } = req.body;
    console.log({ playListName });
    console.log({ userToUpdate });

    const playListNameArray = userToUpdate.playLists.map((item) => item.name);
    console.log(playListNameArray);
    if (playListNameArray.includes(playListName)) {
      res.json({
        success: false,
        message: "PlayList with this name already exist",
      });
    } else {
      const update = await userToUpdate.playLists.addToSet({
        name: playListName,
      });
      await userToUpdate.save();
      console.log({ userToUpdate });
      res.json({ success: true, message: `Playlist ${playListName} created` });
    }
  });

// How to send body with delete response
// .delete(async (req, res) => {
//   const userToUpdate = req.user;
//   console.log({ req });
//   const { playListId } = req.body;
//   console.log({ userToUpdate });
//   console.log({ playListId });

//   const update = await userToUpdate.playLists.pull({ _id: playListId });
//   await userToUpdate.save();
//   console.log({ userToUpdate });

//   res.json({ success: true, message: "delete hit " });
// });

router.route("/delete/:userId/:playListId").delete(async (req, res) => {
  const userToUpdate = req.user;
  // console.log({ req });
  const { playListId } = req.params;
  console.log({ userToUpdate });
  console.log({ playListId });

  const update = await userToUpdate.playLists.pull({ _id: playListId });
  await userToUpdate.save();
  console.log({ userToUpdate });

  res.json({ success: true, message: "delete hit " });
});

router
  .route("/:userId/:playListId")
  .get((req, res) => {
    const user = req.user;
    console.log({ user });
    res.json({ success: true, message: "userid plauylist id get hit " });
  })
  .post(async (req, res) => {
    const { videoId } = req.body;
    const { playListId } = req.params;
    const userToBeUpdate = req.user;
    console.log({ videoId });
    console.log({ playListId });
    console.log({ userToBeUpdate });

    const playListToBeUpdated = userToBeUpdate.playLists.find(
      (item) => item._id == playListId
    );
    const videosInPlayList = playListToBeUpdated.videos.map((item) => item._id);
    console.log({ videosInPlayList });

    console.log({ playListToBeUpdated });

    if (videosInPlayList.includes(videoId)) {
      res.json({
        success: false,
        message: "This video is already present in this  playlist",
      });
    } else {
      const updatedPlayList = extend(playListToBeUpdated, {
        videos: [...playListToBeUpdated.videos, videoId],
      });

      // console.log({ updatedPlayList });

      const userPlaylistUpdated = extend(userToBeUpdate, {
        playLists: [
          ...userToBeUpdate.playLists.filter((item) => item._id != playListId),
          updatedPlayList,
        ],
      });
      console.log({ userPlaylistUpdated });
      await userPlaylistUpdated.save();

      res.json({
        success: true,
        message: "Video added to playlist",
      });
    }
  })

  .delete(async (req, res) => {
    try {
      const { videoId } = req.body;
      const { playListId } = req.params;
      const userToBeUpdate = req.user;
      console.log({ videoId });
      console.log({ playListId });
      console.log({ userToBeUpdate });

      const playListToBeUpdated = userToBeUpdate.playLists.find(
        (item) => item._id == playListId
      );

      const updatedPlayList = extend(playListToBeUpdated, {
        videos: [
          ...playListToBeUpdated.videos.filter((item) => item._id != videoId),
        ],
      });

      const updatedUserPlayList = extend(userToBeUpdate, {
        playLists: [
          ...userToBeUpdate.playLists.filter((item) => item._id != playListId),
          updatedPlayList,
        ],
      });

      await updatedUserPlayList.save();

      res.json({ success: true, message: "Video Has Been Deleted" });
    } catch (error) {
      res.json({
        success: false,
        message: "Error while deleting video from playlist",
        errorMessage: error.message,
      });
    }
  });

router
  .route("/delete/:userId/:playListId/:videoId")
  .delete(async (req, res) => {
    console.log("hit fresh delete");
    console.log({ req });
    try {
      const { videoId } = req.params;
      const { playListId } = req.params;
      const userToBeUpdate = req.user;
      console.log({ videoId });
      console.log({ playListId });
      console.log({ userToBeUpdate });

      const playListToBeUpdated = userToBeUpdate.playLists.find(
        (item) => item._id == playListId
      );

      const updatedPlayList = extend(playListToBeUpdated, {
        videos: [
          ...playListToBeUpdated.videos.filter((item) => item._id != videoId),
        ],
      });

      const updatedUserPlayList = extend(userToBeUpdate, {
        playLists: [
          ...userToBeUpdate.playLists.filter((item) => item._id != playListId),
          updatedPlayList,
        ],
      });

      await updatedUserPlayList.save();

      res.json({ success: true, message: "Video Has Been Deleted" });
    } catch (error) {
      res.json({
        success: false,
        message: "Error while deleting video from playlist",
        errorMessage: error.message,
      });
    }
  });

module.exports = router;
