const Post = require("../models/Post");
const User = require("../models/user");
const fs = require('fs');
const cloudinary = require('cloudinary');
const mongoose = require('mongoose');

const createPost = async (req, res) => {
  let authorAccountType = req.user.accountType
  req.body.accountType = authorAccountType

  try {
    if (authorAccountType === "buyer") {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden! Only Sellers Can Create Posts" });
    }

    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const element = req.files[i];
        if (element.fieldname === 'image') {
          const photoPath = element.path;
          const uploadImage = await cloudinary.v2.uploader.upload(photoPath);
          req.body.image = uploadImage.secure_url;
          fs.unlinkSync(photoPath);
        }
      }
    }
    let authorId = req.user._id
    req.body.authorId = authorId
    const post = await Post.create(req.body);

    return res
      .status(200)
      .json({ success: true, data: post, message: "Post Created successfully" });
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
  let authorId = req.user._id
  req.body.authorId = authorId
  let authorAccountType = req.user.accountType
  req.body.accountType = authorAccountType

  // console.log(authorId)

  try {
    if (authorAccountType === "buyer") {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden! Only Sellers Can Access My Posts" });
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

    if (_.has(req, 'files')) {
      if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const element = req.files[i];
          if (element.fieldname === 'image') {
            const photoPath = element.path;
            const uploadImage = await cloudinary.v2.uploader.upload(photoPath);
            req.body.image = uploadImage.secure_url;
            fs.unlinkSync(photoPath);
          }
        }
      }
    }

    // Update the post
    const post = await Post.findByIdAndUpdate(id, req.body, { new: true, upsert: true });

    // Check if post was found
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    return res.status(200).json({ success: true, data: post, message: "Post updated successfully" });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = { createPost, getAllPosts, getMyPosts, updatePost };