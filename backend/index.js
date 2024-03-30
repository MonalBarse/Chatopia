const express = require('express');
const app = express();                              // Express Application
const cors = require('cors');                        // For Cross-Origin Resource Sharing (here for the front-end to access the back-end)
const connectDB = require('./config/db');                 // Database Connection
const dotenv = require('dotenv');                      // For environment variables
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const colors = require('colors');
const Chat = require('./models/chatModel');
const {
    notFound,
    errorHandler } = require('./middleware/errorHandeling');// Middlewars
const {
    purgeOldMessages
} = require('./utils/purgeMessages');
app.use(cors());
app.use(express.json());                        // This is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser i.e converts the incoming data to JSON
dotenv.config();                                // so we can access the environment variables in the .env file (using process.env.ENV_VARIABLE_NAME)
const PORT = process.env.PORT || 3000;
connectDB();


// For the application we will be using all the routes starting from /api
app.use('/api/user', userRoutes);               // This is the route for the user
app.use('/api/chat', chatRoutes);               // This is the route for the chat
app.use('/api/message', messageRoutes);         // This is the route for the group chat

app.use(notFound);     // this is a middleware that will be called if no route is found

// Schedule the purging process (e.g., every day)
const every_day = 24 * 60 * 60 * 1000;
setInterval(async () => {
    try {
        // Assuming Chat model has a field 'isGroupChat' to distinguish group chats
        const groupChats = await Chat.find({ isGroupChat: true });

        // Iterate over each group chat and purge old messages
        for (const chat of groupChats) {
            await purgeOldMessages(chat._id);
        }

        console.log('Purging completed for all group chats.');
    } catch (error) {
        console.error('Error purging messages:', error);
    }
}, every_day);




app.use(errorHandler); // This is a middleware that will be called if there is an error in the code 
//                        Since we know that the error Handler has error as the first parameter, it should be placed at the end of the middleware stack or the end of the index.js file

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`.cyan.underline);
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:5173',
    },
});

io.on('connection', (socket) => {
    console.log('New socket connection:', socket.id);

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        console.log(`User ${userData.name} joined the socket room.`);
        socket.emit('connected');
    });
    socket.on('join chat', (groupID) => {
        socket.join(groupID);
        console.log(`Socket ${socket.id} joined chat ${groupID}`);
    });

    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

    socket.on('new message', async (newMessageRecieved) => {
        let chat = newMessageRecieved.chat;
        if (!chat) {
            console.log('Chat not found');
            return;
        }
        if (!chat.users) return console.log('chat.users not defined');

        chat.users.forEach(user => {
            if (user._id === newMessageRecieved.sender._id) return;
            socket.in(user._id).emit('message recieved', newMessageRecieved); 
        }); // Emit the message to all users in the chat except the sender
        try {
            // Update the latestMessage property of the chat with the ID of the new message
            await Chat.findByIdAndUpdate(chat._id, { latestMessage: newMessageRecieved._id });
        } catch (error) {
            console.error('Error updating latest message:', error);
        }
    });
    socket.off('setup', () => {
        console.log('Socket disconnected');
        socket.leave(
            userData._id
        );
    });
});