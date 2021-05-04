const mongoose = require("mongoose");
const { Schema } = mongoose;

const videoSchema = new Schema({
  videoId: {
    type: String,
    unique: true,
    required: "Please enter a unique videoId",
  },
  thumbnail: { type: String, required: "Please enter a thumbnail link" },
  channelImage: { type: String },
  category: { type: String, required: "Enter a category the video belongs to" },
  title: { type: String, required: "enter a title for the video" },
  creator: { type: String, required: "enter the creator name" },
  views: { type: Number, required: "enter the number of views" },
  duration: { type: String, required: "enter the duration of video" },
  tags: [String],
});

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
