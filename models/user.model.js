const mongoose = require("mongoose");
const { Schema } = mongoose;
const Video = require("./video.model");

const userSchema = new Schema({
  name: {
    type: String,
    required: "please enter a name",
    unique: "Enter a unique name",
  },
  password: { type: String, required: "please enter a password" },
  likedVideos: [
    {
      type: Schema.Types.ObjectId,
      ref: "Video",
      // index: {
      //   unique: true,
      //   partialFilterExpression: {
      //     likedVideos: { $exists: true },
      //   },
      // },
      // default: null,
    },
  ],
  savedVideos: [],
  playLists: [
    {
      name: {
        type: String,
        required: "Enter a PlayList Name",
        // index: {
        //   unique: true,
        //   partialFilterExpression: {
        //     name: { $exists: true },
        //   },
        // },
        // default: null,
      },
      videos: [
        {
          type: Schema.Types.ObjectId,
          ref: "Video",
          // index: {
          //   unique: true,
          //   partialFilterExpression: {
          //     video: { $exists: true },
          //   },
          // },
          // default: null,
        },
      ],
    },
  ],
});

userSchema.index(
  { "likedVideos._id": 1 },
  {
    unique: true,
    partialFilterExpression: {
      "likedVideos._id": { $exists: true, $gt: {} },
    },
  }
);
userSchema.index(
  { "playLists.name": 1 },
  {
    unique: true,
    partialFilterExpression: {
      "playLists.name": { $exists: true, $gt: "" },
    },
  }
);
userSchema.index(
  { "playLists.videos._id": 1 },
  {
    unique: true,
    partialFilterExpression: {
      "playLists.videos._id": { $exists: true, $gt: {} },
    },
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
