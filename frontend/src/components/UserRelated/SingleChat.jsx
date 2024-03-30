import React, { useEffect } from "react";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import { Box, Text } from "@chakra-ui/layout";
import getSender from "../../config/ChatLogics";
import { getSenderFull } from "../../config/ChatLogics";
import UpdateGroupChatModal from "../Misc/UpdateGroupChatModal";
import ProfileModal from "../Misc/ProfileModal";
import { FormControl, Input, Spinner, Image, useToast } from "@chakra-ui/react";
import inputSVG from "../../media/inputSVG.svg";
import ScrollableChat from "./ScrollableChat";
import {socket} from "../../socket/Websocket";
let selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const toast = useToast();
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [messages, setMessages] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [newMessages, setNewMessages] = React.useState(""); // We will take the input form the input field and store it here
  const [socketConnected, setSocketConnected] = React.useState(false);

  //------------------Socket.io------------------//
  useEffect(() => {
    socket.emit("setup", user); // Emit the user data to the server
    socket.on("connection", () => {
      setSocketConnected((prev) => !prev);
    });
  }, []);
  //------------------xxxxxxxxx------------------//

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        //give notif
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const fetchMessages = async () => {
    if (selectedChat) {
      try {
        setLoading(true);
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(
          `http://localhost:3000/api/message/${selectedChat._id}`,
          config
        );
        console.log(data);
        setMessages(data);
        setLoading(false);
        socket.emit("joinRoom", selectedChat._id); // Join the room for the selected chat
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "Messages could not be fetched",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessages) {
      console.log(selectedChat);
      console.log("Sending message");

      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          "http://localhost:3000/api/message",
          {
            content: newMessages,
            chatID: selectedChat._id,
          },
          config
        );
        setNewMessages("");
        console.log("Message sent");
        console.log(data);
        socket.emit("new message", data); // Emit the new message to the server
        // Append the new message to the messages array
        setMessages([...messages, data]);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "Message could not be sent",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const typingHandler = (event) => {
    setNewMessages(event.target.value);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            pb={3}
            pt={2}
            px={3}
            m={0}
            color="white"
            fontFamily="Work sans"
            borderBottom={"1px solid #666777"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <Text
              display={{ base: "flex", md: "none" }}
              onClick={() => setSelectedChat("")}
              style={{ transition: "all 0.3s ease" }}
              m={0}
              p={0}
              cursor="pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                width="20"
                viewBox="0 0 512 512"
              >
                <path
                  fill="#a7a9c3"
                  d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128z"
                />
              </svg>
            </Text>
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {/* {loading && <Spinner w={5} h={5} color="#a7a9c3"  />} */}
                <Text>{selectedChat.chatName}</Text>
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                ></UpdateGroupChatModal>
              </>
            )}
          </Text>
          <Box
            display={{ base: "flex", md: "flex" }}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            w="100%"
            h="100%"
            bg="rgba(0, 3, 100, 0.15)"
            color="white"
            borderRight={"1px solid #666777"}
            borderLeft={"1px solid #666777"}
            borderBottom={"1px solid #666777"}
            overflowY={"hidden"}
          >
            {/* Messages */}
            {loading ? (
              <Spinner
                w={10}
                h={10}
                color="#a7a9c3"
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <>
                {/* Messages  */}
                <div className="messages">
                  <ScrollableChat messages={messages} />
                </div>
              </>
            )}
            <FormControl onKeyDown={sendMessage} isRequired={true}>
              <Input
                autocomplete="off"
                type="text"
                placeholder={" Type a message "}
                variant={"unstyled"}
                p={3}
                mt={2}
                value={newMessages}
                onChange={typingHandler}
                bg="rgba(0, 3, 100, 0.5)"
                color="#a7a9c3"
                border="none"
                _focus={{ border: "1px solid #a7a9c3" }}
                _hover={{
                  border: "none",
                }}
                _focusVisible={{ border: "none" }}
                _active={{ border: "none" }}
                _placeholder={{ color: "#a7a9c3" }}
                transition={"all 0.3s ease"}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          w="100%"
          h="100%"
          bg="transparent"
        >
          <Text fontSize="2xl" color="#a7a9c3" fontFamily="Work sans">
            Select a chat to start messaging
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
