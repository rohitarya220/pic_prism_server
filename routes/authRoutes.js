const { login, signup } = require('../controllers/authController')

const router = require('express').Router()

router.post('/signup', signup)
router.get('/login', login)


module.exports = router

