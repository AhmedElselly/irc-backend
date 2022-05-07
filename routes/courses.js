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

router.post('/create', upload.single('image'), create);
router.get('/course/:courseId', getCourse);
router.get('/course/:courseId/image', getCourseImage);
router.put('/course/:courseId/update', upload.single('image'), courseUpdate);
router.delete('/course/:courseId/remove', courseRemove);
router.get('/', courseIndex);

router.param('courseId', getCourseById);

module.exports = router;