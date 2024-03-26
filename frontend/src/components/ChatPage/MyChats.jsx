import React from "react";
import axios from "axios";
import { useState,useEffect } from "react";
import { useToast, Box, Menu, Button } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";

function MyChats() {
  const toast = useToast();

  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [loggedUser, setLoggedUser] = useState(null);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        "http://localhost:3000/api/chat",
        config
      );
      console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching chats",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.log(error);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, []);
  return (
  <div>

    

  </div>)
}

export default MyChats;
