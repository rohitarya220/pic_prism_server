const jwt = require('jsonwebtoken');
const User = require('../models/user');


const verifyToken = async (req, res, next) => {
    const authHeader = req.header('Authorization')

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'You are Unauthorized' })
    }

    try {
        const checktoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        let checkUser = await User.findOne({ _id: checktoken.id });
        if (checkUser !== null) {
            req.user = checkUser;
            next();
        } else {
            res.status(401).json({ status: 401, message: "You are Unauthorized. Please Login Again" })
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

module.exports = verifyToken;