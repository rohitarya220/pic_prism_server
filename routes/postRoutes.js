const { createPost, getAllPosts, getMyPosts, updatePost } = require('../controllers/postController')
const verifyToken = require('../middlewares/verifyToken')
const router = require('express').Router()
const fs = require('fs');
const multer = require('multer');
const cloudinary = require('cloudinary');
const request_params = multer();

cloudinary.config({ 
    cloud_name: 'dqt7yomup', 
    api_key: '363783627487427', 
    api_secret: '1A11zv3k3B0XOSk6wOLIhqx_-VY' // Click 'View API Keys' above to copy your API secret
});

const Storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if (!fs.existsSync("./uploads/post")) {
            fs.mkdirSync("./uploads/post");
        }

        callback(null, "./uploads/post");
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
});

const uploadFile = multer({ storage: Storage });

router.post('/post/create', uploadFile.any(), verifyToken, createPost)
router.get('/post/getAll', getAllPosts)
router.get('/post/myPost', verifyToken, getMyPosts)
router.put('/post/update/:id', uploadFile.any(), verifyToken, updatePost)

module.exports = router