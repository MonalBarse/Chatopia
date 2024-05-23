import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import { ChatState } from "../../context/ChatProvider";
import {
  Box,
  Button,
  Text,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useToast,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import UserListItem from "../UserRelated/UserListItem";

const LeftDrawer = React.memo(
  ({
    drawerOpen,
    search,
    setSearch,
    searchResults,
    setSearchResults,
    loading,
    setLoading,
    loadingChat,
    setLoadingChat,
  }) => {
    const toast = useToast();
    const { user, setSelectedChat, chats, setChats } = ChatState();
    const {
      isOpen: isDrawerOpen,
      onOpen: onDrawerOpen,
      onClose: onDrawerClose,
    } = useDisclosure();

    useEffect(() => {
      if (drawerOpen) {
        onDrawerOpen();
      }
    }, [drawerOpen, onDrawerOpen]);
    const [searchAttempted, setSearchAttempted] = useState(false);

    const [isFocused, setIsFocused] = useState(false);
    const handleFocus = () => {
      setIsFocused((prevState) => !prevState);
    };
    const handleBlur = () => {
      setIsFocused((prevState) => !prevState);
    };
    const accessChat = async (userID) => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        };
        const { data } = await axios.post("/api/chat", { userID }, config);
        console.log({ data });

        if (data && data._id) {
          // Check if the chat with the same id already exists in chats
          if (!chats.find((chat) => chat._id === data._id)) {
            setChats([...chats, data]); // Add the new chat to chats
          }
          setSelectedChat(data); // Set the selected chat
          onDrawerClose();
        } else {
          toast({
            title: "An error occurred. Please try again",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "bottom-left",
          });
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "An error occurred. Please try again",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-left",
        });
      } finally {
        setLoading(false);
      }
    };

    const handleSearch = async () => {
      if (search.trim() === "") {
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
        const { data } = await axios.get(`/api/user?search=${search}`, config);
        console.log(search);
        console.log(data);
        console.log(typeof data);
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
          position: "bottom-left",
        });
        setLoading(false);
      }
    };
    return (
      <div>
        <Drawer placement="left" onClose={onDrawerClose} isOpen={isDrawerOpen}>
          <DrawerOverlay />
          <DrawerContent bg="rgba(0, 2, 26, 0.9)" border="1px solid #ccc">
            <DrawerHeader color="white" mt={2}>
              Search Users
            </DrawerHeader>
            <DrawerBody>
              <Box display="flex">
                <input
                  style={{
                    backgroundColor: isFocused
                      ? "rgba(0, 0, 255, 0.09)"
                      : "rgba(0, 2, 26, 0.9)",
                    padding: "7px",
                    borderRadius: "5px",
                    width: "100%",
                    border: "1px solid #ccc",
                    transition: "all 0.3s ease",
                    color: "rgb(133, 133, 133)",
                    caretColor: "white",
                  }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  type="text"
                  placeholder="Search "
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />
                <Button
                  ml={2}
                  colorScheme="outline"
                  color={loading ? "gray" : "white"}
                  _hover={{ bg: "rgba(0, 0, 255, 0.09)" }}
                  variant="outline"
                  onClick={handleSearch}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="#ffffff"
                      d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"
                    />
                  </svg>
                </Button>
              </Box>
              {loading ? (
                // If loading, show the loading indicator
                <ChatLoading loading={loading} />
              ) : Array.isArray(searchResults) && searchResults.length > 0 ? (
                // If there are search results, map through and display them
                searchResults.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
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
            </DrawerBody>

            <DrawerFooter>
              <Button
                bg="rgba(0, 0, 255, 0.09)"
                _hover={{ bg: "rgba(0, 1, 48, 0.09)" }}
                style={{ transition: "all 0.3s ease" }}
                color={"white"}
                fontWeight={"400"}
                variant="outline"
                mr={3}
                onClick={onDrawerClose}
              >
                Close
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    );
  },
);

export default LeftDrawer;
