import React from "react";
import { ChatState } from "../../context/ChatProvider";
import { Box, Text } from "@chakra-ui/layout";
import getSender from "../../config/ChatLogics";
import { getSenderFull } from "../../config/ChatLogics";
import UpdateGroupChatModal from "../Misc/UpdateGroupChatModal";
import ProfileModal from "../Misc/ProfileModal";
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();

  return (
    <>
      {console.log(selectedChat)}
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
                <Text>{selectedChat.chatName}</Text>
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
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
          ></Box>
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
