const express = require("express");
const router = express.Router();
const Video = require("../models/video.model");
const cors = require("cors");

router.use(cors());

router
  .route("/")
  .get(async (req, res) => {
    const videos = await Video.find({});
    res.json({ success: true, message: "sending videos", videos });
  })
  .post(async (req, res) => {
    const items = req.body;
    console.log({ items });
    const newVideo = new Video(items);
    const savedVideoResponse = await newVideo.save();
    res.json({ success: true, savedVideoResponse });
  });

module.exports = router;
