const User = require("../models/user");
// const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
    await user.save()

    return res.status(201).json({sucess: true, message: 'User registered successfully'})
  } catch (error) {
    return res.status(500).json({ sucess: false, message: error.message });
  }
};

const login = async (req, res) => {};

module.exports = { login, signup };
