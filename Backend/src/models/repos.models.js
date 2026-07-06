import mongoose from "mongoose";

const repoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    url: {
      type: String,
      required: true,
      unique: true,
    },
    owner: {
      type: String,
      required: true,
    },
    lang: {
      type: String,
      default: null,
    },
    githubUpdatedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Repo = mongoose.model("Repo", repoSchema);

export default Repo;
