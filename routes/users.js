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

// updating student
router.put('/student/:_id/edit/:userId', isAdmin, upload.single('image'), updateStudent);

// getting specific user not just student
router.get('/student/:_id', getUser);

// registering new user
router.post('/register', foundUser, register);

// login
router.post('/login', checkUserPurchase, login);

// adding new user by admin
router.post('/add-new-user/:userId',  isAdmin, upload.single('image'), foundUser, addNewUser);

// getting all students list only
router.get('/students', getStudents);

// getting all schools list only
router.get('/schools', getSchools);

// getting all statuses
router.get('/statuses', getUserStatus);

// updating user status 
router.put('/statuses/:userId1/update/:userId',  isAdmin, updateUserStatus);

// removing user
router.delete('/statuses/:userId1/remove/:userId',  isAdmin, removeUser);

// get user image
router.get('/user/image/:userId', getUserImage);

// update user password
router.put('/user/change-password/:userId', updatePassword);

// request a token for forget user password
router.put('/user/forgot-password', putForgetPassword);

// receiving user token to make sure itsn't expired
router.get('/user/reset/:token', getReset);

// updating password for forgotten password
router.put('/user/reset/:token', putReset);

// getting all users list with all type
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
