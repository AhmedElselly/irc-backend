const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});

const {
    create,
    getPost,
    createImage,
    getStudentPosts,
    getPostImage,
    getPostById,
    allPosts
} = require('../controllers/posts');

const {
    getUserById
} = require('../controllers/users');

router.post('/create', create);
router.post('/create/image/:userId', upload.single('image'), createImage);
router.get('/post/:userId/assignments', getStudentPosts);
router.get('/image/:postId', getPostImage);
router.get('/post/:postId', getPost);
router.get('/', allPosts);


router.param('userId', getUserById);
router.param('postId', getPostById);

module.exports = router;