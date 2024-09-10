const { createPost, getAllPosts, getMyPosts } = require('../controllers/postController')
const verifyToken = require('../middlewares/verifyToken')

const router = require('express').Router()

router.post('/post/create', verifyToken, createPost)
router.get('/post/getAdd', getAllPosts)
router.get('/post/myPost', verifyToken, getMyPosts)


module.exports = router