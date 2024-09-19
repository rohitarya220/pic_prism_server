const { login, signup, updateUser, userDetail } = require('../controllers/authController')
const verifyToken = require('../middlewares/verifyToken')

const router = require('express').Router()

router.post('/signup', signup)
router.post('/login', login)
router.put('/update/user', verifyToken, updateUser)
router.get('/user/detail', verifyToken, userDetail)


module.exports = router

