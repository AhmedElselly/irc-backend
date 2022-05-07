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

router.post('/create/:userId', isAdmin, upload.single('image'), create);
router.get('/course/:courseId', getCourse);
router.get('/course/:courseId/image', getCourseImage);
router.put('/course/:courseId/update/:userId', isAdmin, upload.single('image'), courseUpdate);
router.delete('/course/:courseId/remove/:userId', isAdmin, courseRemove);
router.get('/', courseIndex);

router.param('courseId', getCourseById);
router.param('userId', getUserById);

module.exports = router;