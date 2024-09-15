const Post = require("../models/Post");
const User = require("../models/user");
const fs = require("fs");
const cloudinary = require("cloudinary");
const mongoose = require("mongoose");

const createPost = async (req, res) => {
  let authorAccountType = req.user.accountType;
  req.body.accountType = authorAccountType;

  try {
    if (authorAccountType === "buyer") {
      return res.status(403).json({
        success: false,
        message: "Forbidden! Only Sellers Can Create Posts",
      });
    }

    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const element = req.files[i];
        if (element.fieldname === "image") {
          const photoPath = element.path;
          const uploadImage = await cloudinary.v2.uploader.upload(photoPath);
          req.body.image = uploadImage.secure_url;
          fs.unlinkSync(photoPath);
        }
      }
    }
    let authorId = req.user._id;
    req.body.authorId = authorId;
    const post = await Post.create(req.body);

    return res.status(200).json({
      success: true,
      data: post,
      message: "Post Created successfully",
    });
  } catch (error) {
    console.log(error.message);
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
  let authorId = req.user._id;
  req.body.authorId = authorId;
  let authorAccountType = req.user.accountType;
  req.body.accountType = authorAccountType;

  // console.log(authorId)

  try {
    if (authorAccountType === "buyer") {
      return res.status(403).json({
        success: false,
        message: "Forbidden! Only Sellers Can Access My Posts",
      });
    }

    const posts = await Post.find({ authorId });
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

const updatePost = async (req, res) => {
  try {
    let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);

    if (_.has(req, "files")) {
      if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const element = req.files[i];
          if (element.fieldname === "image") {
            const photoPath = element.path;
            const uploadImage = await cloudinary.v2.uploader.upload(photoPath);
            req.body.image = uploadImage.secure_url;
            fs.unlinkSync(photoPath);
          }
        }
      }
    }

    // Update the post
    const post = await Post.findByIdAndUpdate(id, req.body, {
      new: true,
      upsert: true,
    });

    // Check if post was found
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    return res.status(200).json({
      success: true,
      data: post,
      message: "Post updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findByIdAndDelete(id);

    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    return res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const searchPost = async (req, res) => {
  const { search } = req.query;
  console.log(search);

  try {
    const searchResult = await Post.find({
      description: { $regex: search, $options: "i" },
    });
    console.log(searchResult);
    if (searchResult.length == 0)
      return res.status(404).json({ success: false, message: "No Post found" });

    return res
      .status(200)
      .json({
        success: true,
        data: searchResult,
        message: "Post successfully Found",
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const addToFavorites = async (req, res) => {
  let authorId = req.user._id;
  req.body.authorId = authorId;
  const { postId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      authorId,
      {
        $addToSet: { favourites: postId },
      },
      { new: true }
    );

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    return res
      .status(200)
      .json({ success: true, data: user, message: "Post added to favorites" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const removeFromFavorites = async (req, res) => {
  let authorId = req.user._id;
  req.body.authorId = authorId;
  const { postId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(authorId, {
      $pull: { favourites: postId },
    });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    return res
      .status(200)
      .json({ success: true, message: "Post Removed from favorites" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getFavourites = async (req, res) => {
  let authorId = req.user._id;
  req.body.authorId = authorId;

  try {
    const { favourites } = await User.findById(authorId).populate("favourites");
    if (!favourites)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    return res.status(200).json({ success: true, data: favourites });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getMyPosts,
  updatePost,
  deletePost,
  searchPost,
  addToFavorites,
  removeFromFavorites,
  getFavourites,
};
