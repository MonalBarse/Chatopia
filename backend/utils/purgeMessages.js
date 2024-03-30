// utils/purgeMessages.js

const Message = require('../models/messageModel');

const purgeOldMessages = async (chatID) => {
    try {
        // Get the total message count in the group chat
        const messageCount = await Message.countDocuments({ chat: chatID });

        // Define the threshold value
        const threshold = 5000;

        // If the message count exceeds the threshold, start purging
        if (messageCount > threshold) {
            // Calculate the number of messages to be deleted (e.g., the first 1000 messages)
            const messagesToDelete = 1000;

            // Retrieve the IDs of the oldest messages in the group chat
            const oldestMessages = await Message.find({ chat: chatID })
                .select('_id')
                .sort({ createdAt: 1 }) // Sort by creation date in ascending order (oldest first)
                .limit(messagesToDelete);

            // Extract the IDs of the oldest messages
            const messageIDsToDelete = oldestMessages.map(message => message._id);

            // Delete the oldest messages from the group chat
            await Message.deleteMany({ _id: { $in: messageIDsToDelete } });

            console.log(`${messagesToDelete} old messages purged from the group chat.`);
        }
    } catch (error) {
        console.error('Error purging old messages:', error);
    }
};

module.exports = purgeOldMessages;
