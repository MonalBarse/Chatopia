const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');

// sendMessage is a controller function that will be called when a post request is made to the /api/message endpoint
// It will create and save a new message in the database
// The old message will be replaced by the new message in the database
const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatID } = req.body;
    if (!content || !chatID) {
        res.status(400);
        throw new Error('Invalid data');
    }
    let newMessage = {
        sender: req.user._id,
        content,
        chat: chatID
    }
    try {
        let message = await Message.create(newMessage);
        message = await message.populate('sender', "name")// We are using execPopulate becasuse we are not using the populate method on the query but on the instance of the query (like not on Message.find() but on message)
        message = await message.populate('chat')
        message = await User.populate(message, { path: 'chat.users', select: "name email" });

        await Chat.findByIdAndUpdate(req.body.chatID, {
            latestMessage: message
        });
        res.status(201).json(message);
    } catch (error) {
        res.status(500);
        throw new Error('Error in creating message:' + error.message);
    }
});


// allMessages will be called when a get request is made to the /api/message/:chatID endpoint

const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatID })
            .populate('sender', 'name email')
            .populate('chat');
        res.status(200).json(messages);

        // We are first finding all the messages of a chat (with the chatID by Message.find which will return an array of all the messages)
        // Then we are populating (i.e in the messages array we are also adding the sender field with the name and email of the sender)
        // Then we are populating the chat field (i.e in the messages array we are also adding the chat field with the chat object)

    } catch (error) {
        res.status(500);
        throw new Error('Error in getting messages:' + error.message);
    }
});


module.exports = { sendMessage, allMessages };