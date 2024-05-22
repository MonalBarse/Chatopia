import io from "socket.io-client";

const ENDPOINT = "https://chatopia-f70q.onrender.com";
export const socket = io(ENDPOINT);
