import React, { useEffect, useState, useRef } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../../context/ChatProvider";
import {
  isSameSender,
  isLastMessage,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogics";
import svgImage from "../../circle-user-solid.svg";
import { Tooltip, Image, Avatar } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const chatBottomRef = useRef(null);

  //----Color for the user profile icon ---- //
  const [color, setColor] = useState("");
  useEffect(() => {
    setColor(`${generateRandomColor()}`);
    scrollToBottom();
  }, [messages]);
  const scrollToBottom = () => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const generateRandomColor = () => {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);

    while (Math.max(r, g, b) > 102) {
      r = Math.floor(Math.random() * 256);
      g = Math.floor(Math.random() * 256);
      b = Math.floor(Math.random() * 256);
    }
    const opacity = 0.35;

    let hexCode =
      "#" +
      r.toString(16).padStart(2, "0") +
      g.toString(16).padStart(2, "0") +
      b.toString(16).padStart(2, "0") +
      Math.round(opacity * 255)
        .toString(16)
        .padStart(2, "0");
    return hexCode;
  };
  // ----------------xxxxxxx---------------- //

  return (
    <div>
      <div
        style={{
          paddingRight: "10px",
          height: "70vh",
          overflowX: "hidden",
          overflowY: "auto",
          scrollbarGutter: "0",
          scrollBehavior: "smooth",
        }}
      >
        {" "}
        {messages &&
          messages.map((message, index) => (
            <div style={{ display: "flex", gap: "5px" }} key={index}>
              {(isSameSender(messages, message, index, user._id) ||
                isLastMessage(messages, index, user._id)) && (
                <Tooltip
                  label={message.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    name={message.sender.name}
                    color={"white"}
                    mt={"7px"}
                    size={"sm"}
                    cursor={"pointer"}
                    background={`${color}`}
                    border={"1px solid #666777"}
                  ></Avatar>
                </Tooltip>
              )}

              <span
                style={{
                  backgroundColor: `${
                    message.sender._id === user._id
                      ? "rgba(0, 2, 76, 0.9)"
                      : "rgba(0, 1,44,0.9)"
                  }`,
                   color: "#dee5ff",
                  marginLeft: isSameSenderMargin(
                    messages,
                    message,
                    index,
                    user._id
                  ),
                  marginTop: isSameUser(messages, message, index) ? 3 : 10,
                  borderRadius: "5px",
                  padding: "5px 15px",
                  maxWidth: "70%",
                }}
              >
                {message.content}
              </span>
            </div>
          ))}
        <div ref={chatBottomRef} />
      </div>
    </div>
  );
};

export default ScrollableChat;
