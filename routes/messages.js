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

// creating a message
router.post('/create', create);

// getting unread messages
router.get('/unread', getUnreadMessages);

// updating the state of the message if marked as read or not
router.put('/:messageId/update', updateReadMessage);

// getting the message ID
router.get('/:messageId', getMessage);

// listing all messages for admin
router.get('/', index);

router.param('messageId', getMessageById);


module.exports = router;