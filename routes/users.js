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
    foundUser,
    removeUser,
    getUserImage,
    updatePassword,
    putForgetPassword,
    getReset,
    putReset
} = require('../controllers/users');
const { isAdmin, isAuth} = require('../middlewares');


router.put('/student/:_id/edit/:userId', isAdmin, upload.single('image'), updateStudent);
router.get('/student/:_id', getUser);
router.post('/register', foundUser, register);
router.post('/login', checkUserPurchase, login);
router.post('/add-new-user/:userId',  isAdmin, upload.single('image'), foundUser, addNewUser);
router.get('/students', getStudents);
router.get('/schools', getSchools);
router.get('/statuses', getUserStatus);
router.put('/statuses/:userId1/update/:userId',  isAdmin, updateUserStatus);
router.delete('/statuses/:userId1/remove/:userId',  isAdmin, removeUser);
router.get('/user/image/:userId', getUserImage);
router.put('/user/change-password/:userId', updatePassword);
router.put('/user/forgot-password', putForgetPassword);
router.get('/user/reset/:token', getReset);
router.put('/user/reset/:token', putReset);
router.get('/', getUsers);


router.param('userId', getUserById);


// testing isAdmin middleware
// router.get('/secret/:userId', isAdmin, (req, res) => {
//     return res.json({message: 'admin success'})
// })

// testing isAuth middleware
// router.get('/isauth', isAuth, (req, res) => {
//     return res.json({message: 'auth success'})
// })

module.exports = router;
