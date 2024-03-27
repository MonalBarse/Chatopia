import React from "react";
import { ChatState } from "../../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "../UserRelated/SingleChat"

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      w={{ base: "100%", md: "65%" }}
      flexDirection="column"
      h="100%"
      bg="rgba(0, 1, 27, 0.7)"
      borderRadius="sm"
      color="white"
      p={4}
      m={0}
      border="1px solid #666777"
    >
      <SingleChat  fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
