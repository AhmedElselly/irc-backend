const express = require('express');
const router = express.Router();

const {
    create,
    index,
    getMessage,
    getMessageById,
    updateReadMessage,
    getUnreadMessages,
} = require('../controllers/messages');

router.post('/create', create);
router.get('/unread', getUnreadMessages);
router.put('/:messageId/update', updateReadMessage);
router.get('/:messageId', getMessage);
router.get('/', index);

router.param('messageId', getMessageById);


module.exports = router;