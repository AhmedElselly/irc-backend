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

const { isAuth } = require('../middlewares');

// creating an marks for every student in the list of excel sheet
router.post('/create', create);

// creating assingment for each student
router.post('/create/image/:userId', isAuth, upload.single('image'), createImage);

// getting student assignments
router.get('/post/:userId/assignments', getStudentPosts);

// getting an assignment image
router.get('/image/:postId', getPostImage);

// getting full assingment
router.get('/post/:postId', getPost);

// getting all assingments
router.get('/', allPosts);


router.param('userId', getUserById);
router.param('postId', getPostById);

module.exports = router;