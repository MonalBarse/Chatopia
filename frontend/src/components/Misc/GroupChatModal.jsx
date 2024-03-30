import React from "react";
import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  Box,
  Input,
  FormControl,
} from "@chakra-ui/react";
import UserBadgeItem from "../UserRelated/UserBadgeItem";
import { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { useDisclosure } from "@chakra-ui/react";
import UserListItem from "../UserRelated/UserListItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const toast = useToast();
  const { user, chats, setChats } = ChatState();

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (selectedUsers.length < 2) {
      toast({
        title: "Add Users",
        description: "Must add at least two user to create a group chat",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    // Send a request to create a group chat
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "http://localhost:3000/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        },
        config
      );
      // console.log(data);
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "Group Chat Created",
        description: "Group chat created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "An error occurred while creating group chat",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
    // console.log(groupChatName, selectedUsers);
  };

  // delete user from selected users
  const handleDelete = (userToDelete) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== userToDelete._id));
  };

  // Function to handle selected users to create a group chat
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "Error",
        description: "User already added",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  // Same search we used in SideDrawer.jsx
  const handleSearch = async (search) => {
    setSearch(search);

    if (search.length > 0) {
      setLoading(true);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(
          `http://localhost:3000/api/user?search=${search}`,
          config
        );
        console.log(data);
        setSearchResults(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "An error occurred while searching for users",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });

        setLoading(false);
        setSearchAttempted(true);
      }
    } else {
      return;
    }
  };
  
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          border={"1px solid #666777"}
          bg="rgba(0, 4, 4, 0.6)"
          backdropFilter="blur(4px)"
          borderRadius="3%"
        >
          <ModalHeader
            color="white"
            fontSize="2xl"
            fontFamily="Work sans"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton
            color="white"
            _hover={{ bg: "transparent", color: "#6d43d3 " }}
          />{" "}
          {/* --------Body------- */}
          <ModalBody color="white" fontFamily="Work sans">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              ></Input>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users"
                mb={2}
                onChange={(e) => handleSearch(e.target.value)}
              ></Input>
            </FormControl>
            <Box display="flex" flexWrap="wrap" w="100%">
              {/* Selected users list */}
              {selectedUsers.length > 0 &&
                selectedUsers.map((user) => (
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleDelete(user)}
                  />
                ))}
            </Box>
            {/* We are going to render users here */}
            {loading ? (
              <span style={{ color: "#666777", marginTop: "15px" }}>
                Loading...
              </span>
            ) : (
              searchResults
                ?.slice(0, 3)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="outline"
              border={"1px solid #666777"}
              mr={3}
              onClick={handleSubmit}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
