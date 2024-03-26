import React from "react";
import { ChatState } from "../../context/ChatProvider";
import { Box } from "@chakra-ui/layout";
import { Avatar, Text } from "@chakra-ui/react";
import userSVG from "../../circle-user-solid.svg";
const UserListItem = ({ user, handleFunction }) => {
  return (
    <div>
      <Box
        onClick={handleFunction}
        style={{ transition: "all 0.3s ease" }}
        cursor="pointer"
        bg="rgba(0, 3, 124, 0.25)"
        _hover={{ bg: "rgba(0, 4, 4, 0.6)" }}
        w={{ base: "100%", md: "100%" }}
        display={{ base: "flex", md: "flex" }}
        alignItems="center"
        color="white"
        px={3}
        py={2}
        mb={3}
        mt={3}
        borderRadius="lg"
      >
        <Avatar size="sm" name={user.name} src={userSVG} mr={3} />
        <Box>
          <Text fontSize="sm" fontWeight="500">
            {user.name}
          </Text>
          <Text fontSize="xs" fontWeight="400"
            color={"gray.400"}
          >
            {user.email}
          </Text>
        </Box>
      </Box>
    </div>
  );
};

export default UserListItem;
