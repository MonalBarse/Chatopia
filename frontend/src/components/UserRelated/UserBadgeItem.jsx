import { Box } from "@chakra-ui/layout";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      bg="rgba(0, 3, 100, 0.35)"
      _hover={{ bg: "rgba(0, 4, 4, 0.6)", color: "white" }}
      style={{ transition: "all 0.3s ease" }}
      fontSize={12}
      cursor={"pointer"}
      alignItems="center"
      color="gray.400"
      px={2}
      py={1}
      mb={2}
      m={1}
      borderRadius="sm"
      display={"flex"}
      onClick={handleFunction}
    >
      {user.name}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="12"
        width="12"
        style={{ marginLeft: "5px", marginTop: "1px" }}
        viewBox="0 0 512 512"
      >
        <path
          fill="#ffffff"
          d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"
        />
      </svg>
    </Box>
  );
};

export default UserBadgeItem;
