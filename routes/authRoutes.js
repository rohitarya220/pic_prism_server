const { login, signup, updateUser } = require('../controllers/authController')
const verifyToken = require('../middlewares/verifyToken')

const router = require('express').Router()

router.post('/signup', signup)
router.post('/login', login)
router.put('/update/user', verifyToken, updateUser)


module.exports = router

