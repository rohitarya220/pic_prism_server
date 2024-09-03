const { login, signup } = require('../controllers/authController')
const router = require('express').Router()

router.get('/login', login)
router.get('/signup', signup)


module.exports = router

