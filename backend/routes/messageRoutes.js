const express = require('express');
const router = express.Router();
const { sendMessage, allMessages } = require('../controllers/messageControllers');
const { protect } = require('../middleware/authorization')



router.route('/').post(protect, sendMessage);
router.route('/:chatID').get(protect, allMessages); // This endpoint will be used to get all the messages of a chat

module.exports = router;