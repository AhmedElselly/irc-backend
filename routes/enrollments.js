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
	removeEnrol,
} = require('../controllers/enrollments');

const { isAdmin } = require('../middlewares');

// adding new enrollment
router.post('/new/:courseId/:userId', isAdmin, create);

// listing enrollments for student to show what he enrolled for
router.get('/learn-list/:userId', listByStudent);

// removing an enrollment for student
router.delete('/remove/:userId/:enrolId', removeEnrol);

// finding an enrollment
router.get('/read/:courseId/:userId', findEnrollment, read);



router.param('courseId', getCourseById);
router.param('userId', getUserById);
router.param('enrolId', getEnrollmentById);

module.exports = router;