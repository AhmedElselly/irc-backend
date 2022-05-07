const express = require('express');
const router = express.Router();

// const {
// 	isAuth
// } = require('../middlewares');

const {
	getCourseById
} = require('../controllers/course');

const {
	getUserById
} = require('../controllers/users');

const {
	create,
	findEnrollment,
	getEnrollmentById,
	read,
	listByStudent,
} = require('../controllers/enrollments');

const { isAdmin } = require('../middlewares');


router.post('/new/:courseId/:userId', isAdmin, create);
router.get('/learn-list/:userId', listByStudent);
router.get('/read/:courseId/:userId', findEnrollment, read);



router.param('courseId', getCourseById);
router.param('userId', getUserById);
router.param('enrolId', getEnrollmentById);

module.exports = router;