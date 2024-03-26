import React from 'react';

const getSender = (loggedUser, users) => {
  if (loggedUser && users && users.length >= 2 && users[0] && users[1]) {
    return users[0]._id === loggedUser._id ? users[1] : users[0].name;
  } else {
    // Handle cases where loggedUser, users, or users[0] is null or undefined
    return "Sender Not Found";
  }
};

export default getSender;
