const User = require("../models/user");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../helpers/accessToken");

const signup = async (req, res) => {
  const { username, email, password, accountType } = req.body;

  try {
    let user = await User.findOne({ username });

    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Username already in use!" });
    }

    const securePassword = await bcrypt.hash(password, 10);

    user = new User({
      username,
      email,
      password: securePassword,
      accountType,
    });
    await user.save();

    return res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User Not Found" });
    }

    const comparedPassword = await bcrypt.compare(password, user.password);
    if (!comparedPassword)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const data = {
      id: user._id,
      accountType: user.accountType,
      author: user.username,
    };

    const accessToken = "Bearer " + generateAccessToken(data);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      accessToken,
      role: user.accountType,
      author: user.username,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  const { username, email, password, accountType } = req.body;
  let authorId = req.user._id;
  req.body.authorId = authorId;

  try {
    if (accountType)
      return res
        .status(400)
        .json({ success: false, message: "Accout type can not be Updated" });
    if (!authorId)
      return res.status(403).json({ success: false, message: "Invalid User" });

    if (password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(authorId, req.body, {
      new: true,
    });
    if (!updatedUser)
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });

    return res
      .status(200)
      .json({
        success: true,
        message: "User Updated Successfully",
        updatedUser,
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const userDetail = async (req, res) => {
  let authorId = req.user._id;
  req.body.authorId = authorId;

  try {
    const user = await User.findOne({ _id: authorId }).select("-password -purchased -uploads");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    return res
      .status(200)
      .json({ success: true, data: user, message: "User Details" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { login, signup, updateUser, userDetail };
