import io from "socket.io-client";

const ENDPOINT = "https://chatopia-f70q.onrender.com/";

// const ENDPOINT = 'http://localhost:3000';
export const socket = io(ENDPOINT);
