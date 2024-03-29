const getSender = (loggedUser, users) => {
  if (loggedUser && users && users.length >= 2 && users[0] && users[1]) {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  } else {
    // Handle cases where loggedUser, users, or users[0] is null or undefined
    return "Sender Not Found";
  }
};
export default getSender;

export const getSenderFull = (loggedUser, users) => {
  if (loggedUser && users && users.length >= 2 && users[0] && users[1]) {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
  } else {
    // Handle cases where loggedUser, users, or users[0] is null or undefined
    return "Sender Not Found";
  }
};
export const isSameSender = (messages, message, index, userID) => {
  return (
    // This is for displaying user profile icon
    index < messages.length - 1 &&
    (messages[index + 1].sender._id !== message.sender._id ||
      messages[index + 1].sender._id === undefined) &&
    messages[index].sender._id !== userID
  );
};
/* 
 This isSameSender function is used to display the user profile icon in the chat.
  It takes in the messages, message, index, and userID as arguments.
  we will use this to display profile if the sender is different from the previous message sender and the current user and is defined.
*/
export const isLastMessage = (messages, index, userID) => {
  return (
    index === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userID &&
    messages[messages.length - 1].sender._id
  );
};
/* 
    This is isLastMessage function which tells us if the message is the last message in the chat.
    it takes messages and index and userID as arguments.
    If the index is the last index in the messages array and the sender of the last message is not the current user and is defined, then it returns true.
*/

export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 37;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};
export const isSameUser = (messages, message, index) => {
  return index > 0 && messages[index - 1].sender._id === message.sender._id;
};


