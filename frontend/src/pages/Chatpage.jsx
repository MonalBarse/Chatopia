import React, { useEffect, useState } from "react";
import axios from "axios";
import MyChats from "../components/ChatPage/MyChats";
import ChatBox from "../components/ChatPage/ChatBox";
import SideDrawer from "../components/Misc/SideDrawer";
import { useLoaderData } from "react-router-dom";

import { ChatState } from "../context/ChatProvider";
import { Box } from "@chakra-ui/react";
function Chatpage() {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ color: "white", width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        padding="9px"
        justifyContent="space-between"
        w="100%"
        h="91vh"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
}

export default Chatpage;
