import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";

import {
  Box,
  Tooltip,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  flexbox,
} from "@chakra-ui/react";

import { useDisclosure } from "@chakra-ui/react";
import LeftDrawer from "./LeftDrawer";
import ProfileModal from "./ProfileModal";
import { ChatState } from "../../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import LogoutConfirmationModal from "./LogoutConfirm";
import getSender from "../../config/ChatLogics";

const SideDrawer = React.memo(() => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user, notifications, setNotifications, setSelectedChat } =
    ChatState();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawerOpen = () => {
    setDrawerOpen((prevState) => !prevState);
  };

  // State and functions for Drawer component
  // const {
  //   isOpen: isDrawerOpen,
  //   onOpen: onDrawerOpen,
  //   onClose: onDrawerClose,
  // } = useDisclosure();
  // const [isFocused, setIsFocused] = useState(false);
  // const handleFocus = () => {
  //   setIsFocused(prevState => !prevState);
  // };
  // const handleBlur = () => {
  //   setIsFocused((prevState) => !prevState  );
  // };
  return (
    <div
      style={{
        margin: "9px 9px 0 9px",
        backgroundColor: "rgba(0, 2, 26, 0.9)",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        p=" 10px 15px 10px 15px"
        borderWidth="1px"
        borderColor="rgba(255, 255, 255, 0.4)"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button
            onClick={handleDrawerOpen}
            colorScheme="blue"
            variant="outline "
            _hover={{ bg: "rgba(0, 0, 255, 0.09)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              width="20"
              viewBox="0 0 512 512"
            >
              <path
                fill="#fafafa"
                d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
              />
            </svg>{" "}
            <Text display={{ base: "none", md: "flex" }} px="6">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="3xl" fontFamily="Work sans" color="white">
          Chatopia
        </Text>
        <div style={{ display: "flex" }}>
          <Menu style={{ alignItems: "" }}>
            <MenuButton as={Button} minHeight="auto" colorScheme="transparent">
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                width="21"
                viewBox="0 0 448 512"
              >
                <path
                  fill="#fafafa"
                  d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v25.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112v25.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V208c0-61.9 50.1-112 112-112zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"
                />
              </svg> */}
              {notifications.length > 0 ?( <FontAwesomeIcon
                icon={faBell}
                size="xl"
                fade
                style={{ color: "#ffffff" }}
              />):( <FontAwesomeIcon
                icon={faBell}
                size="xl"
                style={{ color: "#ffffff" }}
              />)}
             
            </MenuButton>
            <MenuList
              backdropFilter="blur(2px)"
              bg="rgba(0, 4, 4, 0.5)"
              color={"white"}
              p={3}
            >
              {!notifications.length && "No New Messages"}
              {notifications.map((notification) => (
                <MenuItem
                  onClick={() => {
                    setLoadingChat(true);
                    setSelectedChat(notification.chat);
                    setNotifications(
                      notifications.filter(
                        (noti) => noti.chat._id !== notification.chat._id
                      )
                    );
                  }}
                  key={notification._id}
                  bg="rgba(0, 4, 4, 0.6)"
                  _hover={{
                    bg: "rgba(50, 3, 255, 0.15)",
                    transition: "background-color 0.1s ease-in-out",
                  }}
                  transition="background-color 0.8s ease-in-out"
                >
                  {console.log(notification.chat.users)}{" "}
                  {notification.chat.isGroupChat
                    ? `${notification.chat.chatName} `
                    : `${getSender(user, notification.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              minHeight="auto"
              colorScheme="transparent"
              mr="2px"
              rightIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="15"
                  width="18"
                  transform="translate(5)"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="#ffffff"
                    d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
                  />
                </svg>
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                width="21"
                viewBox="0 0 448 512"
              >
                <path
                  fill="#ffffff"
                  d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"
                />
              </svg>
            </MenuButton>
            <MenuList backdropFilter="blur(2px)" bg="rgba(0, 4, 4, 0.5)">
              <ProfileModal user={user}>
                <MenuItem
                  bg="rgba(0, 4, 4, 0.6)"
                  _hover={{
                    bg: "rgba(50, 3, 255, 0.15)",
                    transition: "background-color 0.1s ease-in-out",
                  }}
                  transition="background-color 0.8s ease-in-out"
                >
                  My Porfile
                </MenuItem>
              </ProfileModal>
              <LogoutConfirmationModal user={user}>
                <MenuItem
                  bg="rgba(0, 4, 4, 0.6)"
                  _hover={{
                    bg: "rgba(50, 3, 255, 0.15)",
                    transition: "background-color 0.2s ease-in-out",
                  }}
                  transition="background-color 0.8s ease-in-out"
                >
                  Logout
                </MenuItem>
              </LogoutConfirmationModal>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <LeftDrawer
        search={search}
        setSearch={setSearch}
        drawerOpen={drawerOpen}
        loading={loading}
        setLoading={setLoading}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        loadingChat={loadingChat}
        setLoadingChat={setLoadingChat}
      ></LeftDrawer>
      {/*  <Drawer placement="left" onClose={onDrawerClose} isOpen={isDrawerOpen}>
        <DrawerOverlay />
        <DrawerContent bg="rgba(0, 2, 26, 0.9)" border="1px solid #ccc">
          <DrawerHeader color="white" mt={2}>
            Search Users
          </DrawerHeader>
          <DrawerBody>
            <Box display="flex">
              <input
                style={{
                  backgroundColor: isFocused? "rgba(0, 0, 255, 0.09)":"rgba(0, 2, 26, 0.9)" ,
                  padding: "7px",
                  borderRadius: "5px",
                  width: "100%",
                  border: "1px solid #ccc",
                  transition: "all 0.3s ease",
                  color: "rgb(133, 133, 133)",
                  caretColor: "white"
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

                onClick={() => {
                  setLoading(true);
                  setSearchResults([]);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg"
                  width="22"
                viewBox="0 0 512 512">
                  <path
                    fill="#ffffff"
                    d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"
                  />
                </svg>
              </Button>
            </Box>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onDrawerClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer> */}
    </div>
  );
});
export default SideDrawer;
