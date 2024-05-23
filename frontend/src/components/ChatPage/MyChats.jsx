import axios from "axios";
import { useState, useEffect } from "react";
import { useToast, Text, Box, Button, Stack } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import ChatLoading from "../Misc/ChatLoading";
import getSender from "../../config/ChatLogics";
import GroupChatModal from "../Misc/GroupChatModal";

import { socket } from "../../socket/Websocket";

const MyChats = ({ fetchAgain }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) => {
          if (chat._id === newMessageRecieved.chat._id) {
            return {
              ...chat,
              latestMessage: newMessageRecieved,
            };
          }
          return chat;
        });
        return updatedChats.sort((a, b) => {
          const lastMessageA = a.latestMessage
            ? new Date(a.latestMessage.createdAt)
            : 0;
          const lastMessageB = b.latestMessage
            ? new Date(b.latestMessage.createdAt)
            : 0;
          return lastMessageB - lastMessageA;
        });
      });
    });
    //Clean up function
    return () => {
      socket.off("message recieved"); // Disconnect WebSocket when component unmounts
    };
  }, [setChats, fetchAgain, chats]);

  /* useEffect(() => {
  // Connect to WebSocket server
  const socket = socketIOClient("url");

  // Listen for new message events
  socket.on("message received", (newMessage) => {
    // Update the chat state with the new message
    setChats((prevChats) => {
      const updatedChats = prevChats.map((chat) => {
        if (chat._id === newMessage.chat._id) {
          // Update the latest message of the chat
          return { ...chat, latestMessage: newMessage };
        }
        return chat;
      });
      // Sort chats based on the latest message
      return updatedChats.sort((a, b) => {
        const lastMessageA = a.latestMessage
          ? new Date(a.latestMessage.createdAt)
          : 0;
        const lastMessageB = b.latestMessage
          ? new Date(b.latestMessage.createdAt)
          : 0;
        return lastMessageB - lastMessageA;
      });
    });
  });

  // Cleanup function
  return () => {
    socket.disconnect(); // Disconnect WebSocket when component unmounts
  };
}, [setChats]); */

  const fetchChats = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      // console.log(`MyChats.jsx: ${{data}}` );
      console.log({ data });
      console.log(chats);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      w={{ base: "100%", md: "35%" }}
      h="100%"
      bg="rgba(0, 1, 27, 0.7)"
      color="white"
      p={3}
      mr={2}
      borderRadius="sm"
      border="1px solid #666777"
      flexDirection="column"
      alignItems="center"
    >
      <Box
        pb={4}
        pt={2}
        px={3}
        fontSize={{ base: "xl", md: "2xl" }}
        fontFamily={"Work sans"}
        display="flex"
        fontWeight={500}
        w={{ base: "100%", md: "100%" }}
        justifyContent="space-between"
        alignItems="center"
        borderBottom={"1px solid #666777"}
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            bg="rgba(0, 0, 180, 0.09)"
            variant={"outline"}
            border={"1px solid #666777"}
            _hover={{ bg: "transparent" }}
            fontSize={{ base: "sm", md: "md", lg: "lg" }}
            color="gray.300"
            fontWeight={400}
            rightIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height={15}
                width={15}
                viewBox="0 0 448 512"
              >
                <path
                  fill="#ffffff"
                  d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
                />
              </svg>
            }
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        w={{ base: "100%", md: "100%" }}
        h={{ base: "100%", md: "100%" }}
        overflowY="hidden"
        borderRadius={"md"}
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        p={3}
      >
        {chats ? (
          <Stack overflowY={"scroll"} p={3}>
            {chats.map((chat) => (
              <Box
                style={{ transition: "all 0.3s ease" }}
                onClick={() => setSelectedChat(chat)}
                key={chat._id}
                cursor={"pointer"}
                bg={
                  selectedChat === chat
                    ? "rgba(0, 3, 124, 0.25)"
                    : "transparent"
                }
                _hover={{ bg: "rgba(0, 3, 124, 0.25)" }}
                transform={selectedChat === chat ? "scale(1.04)" : "scale(1)"}
                fontSize={{ base: "md", md: "lg" }}
                color={selectedChat === chat ? "white" : "gray.400"}
                px={4}
                py={2}
                borderRadius={"md"}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users) // Assuming getSender returns a user object
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading loading={loading} />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
