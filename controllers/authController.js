const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../helpers/accessToken");
const { generateRefreshToken } = require("../helpers/refreshToken");

const signup = async (req, res) => {
  const { username, email, password, accountType } = req.body;

  try {
    let user = await User.findOne({ username });

    if (user) {
      return res
        .status(400)
        .json({ sucess: false, message: "Username already in use!" });
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
      .json({ sucess: true, message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ sucess: false, message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ sucess: false, message: "User Not Found" });
    }

    const comparedPassword = await bcrypt.compare(password, user.password);
    if (!comparedPassword)
      return res
        .status(400)
        .json({ sucess: false, message: "Invalid credentials" });

    const data = {
      id: user._id,
      accountType: user.accountType,
      author: user.username
    }

    const accessToken = generateAccessToken(data)
    const refreshToken = generateRefreshToken(data)
    console.log(accessToken)

    return res.status(200).json({
      sucess: true,
      message: "Logged in successfully",
      accessToken,
      refreshToken,
      role: user.accountType,
      author: user.username
    })
  } catch (error) {
    return res.status(500).json({ sucess: false, message: error.message });
  }
};

module.exports = { login, signup };
