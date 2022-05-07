const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});

const {
    register,
    login,
    addNewUser,
    getStudents,
    getUser,
    updateStudent,
    getSchools,
    getUsers,
    getUserStatus,
    getUserById,
    updateUserStatus,
    checkUserPurchase,
    foundUser
} = require('../controllers/users');

router.put('/student/:_id/edit', upload.single('image'), updateStudent);
router.get('/student/:_id', getUser);
router.post('/register', foundUser, register);
router.post('/login', checkUserPurchase, login);
router.post('/add-new-user', upload.single('image'), foundUser, addNewUser);
router.get('/students', getStudents);
router.get('/schools', getSchools);
router.get('/statuses', getUserStatus);
router.put('/statuses/:userId', updateUserStatus);
router.get('/', getUsers);

router.param('userId', getUserById);

module.exports = router;
