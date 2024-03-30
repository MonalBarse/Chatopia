# Chatopia

## - A real-time text chat platform

## Overview

Welcome to Chatopia – a project designed for me to learn the MERN stack (MongoDB, Express.js, React.js, Node.js). This application serves as a practical learning experience, allowing me to delve into the world of real-time chat applications while mastering the core technologies of the MERN stack.

- Also, if you want to follow how I approached building this from scratch, you can check out [Learnings](./Learnings.md) file. I tend to update this every time I make any progress.

## Features

- **Account Creation:** Users can create accounts to personalize their chat experience.
- **Chat Rooms:** Join different chat rooms for diverse conversations.
- **Real-time Messaging:** Utilizes web sockets for instant communication.
- **Data Storage:** MongoDB is employed for efficient and scalable data storage.

## Tech Stack

- **Frontend:** Built with React.js for a dynamic and responsive user interface. And utilizing React's Context API for state management.
- **Backend:** Developed using Node.js and Express.js to handle server-side logic.
- **Database:** MongoDB serves as the database for storing user accounts and chat data.
- **Websockets:** Enables real-time communication for a seamless chatting experience.

## Getting Started

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/MonalBarse/chat-app.git

   ```

2. **Install Dependencies:**

   ```bash
   cd Chatopia
   npm install
   cd frontend
   npm install
   ```

   3 **Run the Application:**

   ```bash
   cd Chatopia/frontend
   npm run dev
   ```

   This will start the frontend

3. **Run the Backend:**

   ```bash
   cd Chatopia
   npm start
   ```

   This will start the backend

4. **Open the Application:**
   Open [http://localhost:5713](http://localhost:5713) to view it in the browser.

## Note: 
- Register for an account by providing a username and password. Once registered, you can log in to access the chat rooms.
- This is a begginer project, so you can chat with any person in the database by just entering their username in the chat room. Please do not use or share any sensitive information.
- You can also create a new chat room by entering the name of the chat room in the chat room input field.

  ## Contributing

  Feel free to contribute by:

Reporting issues
Adding new features
Improving existing code
