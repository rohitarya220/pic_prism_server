const Post = require("../models/Post");
const User = require("../models/user");

const createPost = async (req, res) => {
  const authorId = req.id;
  const authorAccountType = req.accountType;

  if (authorAccountType == "Buyer") {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden! Only Sellers Can Post" });
  }

  const { title, author, price, image, publicId } = req.body;

  try {
    const post = new Post({ title, author, price, image, publicId, authorId });
    await post.save();

    await User.findByIdAndDelete(authorId, {
      $push: { uploads: post._id },
    });

    return res
      .status(201)
      .json({ success: true, message: "Post Crated successfully", post });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    if (posts.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No posts found" });
    }

    return res.status(200).json({ success: true, data: posts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getMyPosts = async (req, res) => {
  const authorId = req.id;
  const authorAccountType = req.accountType;

  try {
    if (authorAccountType === "buyer") {
      const { purchased } = await User.findById(authorId).populate("purchased");

      if (!purchased)
        return res
          .status(404)
          .json({ success: false, message: "No Posts Found" });
      return res.status(200).json({ success: true, data: purchased });
    } else {
      const { uploads } = await User.findById(authorId).populate("uploads");

      if (!uploads)
        return res
          .status(404)
          .json({ success: false, message: "No Posts Found" });
      return res.status(200).json({ success: true, message: "Post Upload" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createPost, getAllPosts, getMyPosts };
