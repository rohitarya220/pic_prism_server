const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { createPost, getAllPosts, getMyPosts, updatePost, deletePost, searchPost, addToFavorites, removeFromFavorites, getFavourites } = require('../controllers/postController');
const verifyToken = require('../middlewares/verifyToken');

// Cloudinary configuration
cloudinary.config({
    cloud_name: 'dqt7yomup',
    api_key: '363783627487427',
    api_secret: '1A11zv3k3B0XOSk6wOLIhqx_-VY'
});

// Multer setup for file storage
const Storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const uploadDir = "./uploads/post";
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
});

const uploadFile = multer({ storage: Storage });

// Route for creating & updating a post with image upload
router.post('/post/create', uploadFile.any(), verifyToken, createPost);
router.put('/post/update/:id', uploadFile.any(), verifyToken, updatePost);
// Other routes
router.get('/post/getAll', getAllPosts);
router.post('/post/myPost', verifyToken, getMyPosts);
router.delete('/post/delete/:id', verifyToken, deletePost);
router.get('/post/favourite/:postId', verifyToken, addToFavorites);
router.get('/post/remove/favourite/:postId', verifyToken, removeFromFavorites);
router.get('/post/Favourite/list', verifyToken, getFavourites);
router.post('/post/search', searchPost);

module.exports = router;
