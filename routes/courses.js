const express = require('express');
const router = express.Router();
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

const {
    create,
    getCourse,
    courseIndex,
    courseUpdate,
    courseRemove,
    getCourseById,
    getCourseImage
} = require('../controllers/course');

const {
    getUserById
} = require('../controllers/users');

const { isAdmin } = require('../middlewares');

// creating a course (device)
router.post('/create/:userId', isAdmin, upload.single('image'), create);

// getting a course
router.get('/course/:courseId', getCourse);

// getting course image
router.get('/course/:courseId/image', getCourseImage);

// updating the course
router.put('/course/:courseId/update/:userId', isAdmin, upload.single('image'), courseUpdate);

// deleting the course
router.delete('/course/:courseId/remove/:userId', isAdmin, courseRemove);

// get all courses
router.get('/', courseIndex);

router.param('courseId', getCourseById);
router.param('userId', getUserById);

module.exports = router;