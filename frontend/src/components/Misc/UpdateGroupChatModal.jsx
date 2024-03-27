import React from "react";
import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Box,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";

import UserBadgeItem from "../UserRelated/UserBadgeItem";
import { set } from "mongoose";
import UserListItem from "../UserRelated/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupName, setGroupName] = useState("");

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false); // for renaming group chat
  const [searchAttempted, setSearchAttempted] = useState(false);
  const toast = useToast();

  const handleRenameGroupChat = async () => {
    if (!groupName) {
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
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:3000/api/chat/rename`,
        { chatID: selectedChat._id, newName: groupName },
        config
      );
      setSelectedChat(data);
      setFetchAgain((prev) => !prev);
      setRenameLoading(false);
      toast({
        title: "Success",
        description: "Group chat updated",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      onClose();
    } catch (error) {
      setRenameLoading(false);
      console.error(error);
      toast({
        title: "Error",
        description: error.response,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
    setGroupName("");
  };
// ------------------------------ //
  const debounce = (func, delay) => {
    let timerId;
    return (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };
  const handleSearch = async (qurey) => {
    setSearch(qurey);
    if (qurey.trim() === "") {
        toast({
            title: "Please enter a valid search term",
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "top-left",
        });
        return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.get(
        `http://localhost:3000/api/user?search=${search}`,
        config
      );
      console.log("Search result" + data);
      setSearchResults(data);
      setLoading(false);
      setSearchAttempted(true);
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred. Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

    const debouncedSearch = debounce(handleSearch, 500);  

//   -------------------------------- //
  const handleGroup = async (toAddUser) => {
    if (selectedChat.users.find((u) => u._id === toAddUser._id)) {
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
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Error",
        description: "You are not the admin of this group",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:3000/api/chat/groupadd`,
        {
          chatID: selectedChat._id,
          userID: toAddUser._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain((prev) => !prev);
      toast({
        title: "Success",
        description: "User added to group",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error.response.data,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };
  const handleRemoveUser = async (toRemoveUser) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      toRemoveUser._id !== user._id
    ) {
      toast({
        title: "Error",
        description: "Only admin can remove users",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:3000/api/chat/groupremove`,
        {
          chatID: selectedChat._id,
          userID: toRemoveUser._id,
        },
        config
      );
      toRemoveUser._id === user._id
        ? setSelectedChat(null)
        : setSelectedChat(data);
      setFetchAgain((prev) => !prev);
      setLoading(false);
      toast({
        title: "Success",
        description:
          user._id === toRemoveUser._id
            ? "You left the group"
            : "User removed from group",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error.response.data,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        onClick={onOpen}
        bg={"transparent"}
        _hover={{ bg: "rgba(0, 2, 255, 0.1)" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20"
          width="20"
          viewBox="0 0 512 512"
        >
          <path
            fill="#c4c7c8"
            d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"
          />
        </svg>
      </Button>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          bg="rgba(0, 4, 4, 0.6)"
          backdropFilter="blur(4px)"
          borderRadius="3%"
          border={"1px solid #666777"}
        >
          {" "}
          <ModalHeader
            color="white"
            fontSize="2xl"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton
            color="white"
            _hover={{ bg: "transparent", color: "#6d43d3 " }}
          />{" "}
          <ModalBody
            color="rgba(255, 255, 255, 0.7)"
            fontFamily="Work sans"
            justifyContent="center"
          >
            <Box
              display="flex"
              flexWrap="wrap"
              w="100%"
              justifyContent="center"
              mb={4}
            >
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemoveUser(u)}
                />
              ))}
            </Box>

            <FormControl display={"flex"} p={3} gap={2}>
              {/* <FormLabel>Group Name</FormLabel> */}
              <Input
                placeholder="Group Name"
                type="text"
                value={groupName}
                border={"1px solid #666777"}
                // onFocus={{border: "1px solid #666777"}}
                borderRadius={"5px"}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <Button
                variant={"outline"}
                border={"1px solid #666777"}
                _hover={{ bg: "transparent" }}
                bg={"rgba(0, 0, 180, 0.09)"}
                color={"gray.300"}
                borderRadius={"5px"}
                isLoading={renameLoading}
                onClick={handleRenameGroupChat}
              >
                Update
              </Button>
            </FormControl>
            <FormControl display={"flex"} p={3} gap={2}>
              <Input
                placeholder="Add Users"
                type="text"
                border={"1px solid #666777"}
                borderRadius={"5px"}
                onChange={(e) => debouncedSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <span style={{ color: "#666777", marginTop: "15px" }}>
                Loading...
              </span>
            ) : Array.isArray(searchResults) && searchResults.length > 0 ? (
              searchResults.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
            ) : (
              // If no search results, display a message
              searchAttempted && (
                <Box
                  bg="rgba(0, 3, 124, 0.25)"
                  _hover={{ bg: "rgba(0, 4, 4, 0.6)" }}
                  w={{ base: "100%", md: "100%" }}
                  display={{ base: "flex", md: "flex" }}
                  alignItems="center"
                  color="gray.400"
                  px={3}
                  py={3}
                  mb={3}
                  mt={5}
                  borderRadius="lg"
                >
                  <Text>No users found</Text>
                </Box>
              )
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              bg={"transparent"}
              color={"gray.300"}
              fontWeight={300}
              _hover={{ bg: "rgba(0, 2, 255, 0.16)" }}
              onClick={() => {
                handleRemoveUser(user);
              }}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
