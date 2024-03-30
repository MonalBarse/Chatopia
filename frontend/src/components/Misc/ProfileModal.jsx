import React from "react";
import { useDisclosure } from "@chakra-ui/react";
import svgImage from "../../circle-user-solid.svg";
import profileBack from "../../profileBack.png";
import {
  Button,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import { Flex, Image, useColorModeValue } from "@chakra-ui/react";

const ProfileModal = React.memo(({ user, children }) => {
  // ============================= //
  let boxBg = useColorModeValue("transparent !important", "#111c44 !important");
  let mainText = useColorModeValue("white", "white");
  let secondaryText = useColorModeValue("gray.400", "gray.400");
  // ============================= //

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <Button
          variant="ghost"
          onClick={onOpen}
          bg={"transparent"}
          _hover={{ bg: "rgba(0, 2, 255, 0.1)" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            width="22.5"
            viewBox="0 0 576 512"
          >
            <path
              fill="#ffffff"
              d="M512 80c8.8 0 16 7.2 16 16V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16H512zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM208 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128zm-32 32c-44.2 0-80 35.8-80 80c0 8.8 7.2 16 16 16H304c8.8 0 16-7.2 16-16c0-44.2-35.8-80-80-80H176zM376 144c-13.3 0-24 10.7-24 24s10.7 24 24 24h80c13.3 0 24-10.7 24-24s-10.7-24-24-24H376zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24h80c13.3 0 24-10.7 24-24s-10.7-24-24-24H376z"
            />
          </svg>{" "}
        </Button>
      )}
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
            display="flex"
            justifyContent="center"
          >
            Profile
          </ModalHeader>
          <ModalCloseButton
            color="white"
            _hover={{ bg: "transparent", color: "#6d43d3 " }}
          />
          <ModalBody
            color="white"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            <Flex
              borderRadius="20px"
              bg={boxBg}
              p="20px"
              h="345px"
              w={{ base: "315px", md: "345px" }}
              alignItems="center"
              direction="column"
            >
              <Image src={profileBack} maxW="100%" borderRadius="20px" />
              <Flex flexDirection="column" mb="30px">
                <Image
                  src={svgImage}
                  border="5px solid black"
                  mx="auto"
                  borderColor={boxBg}
                  width="68px"
                  height="68px"
                  mt="-38px"
                  borderRadius="50%"
                  p="7px"
                />
                <Text
                  fontWeight="600"
                  color={mainText}
                  textAlign="center"
                  fontSize="xl"
                >
                  {user && user.name}
                </Text>
                <Text
                  color={secondaryText}
                  textAlign="center"
                  fontSize="sm"
                  fontWeight="500"
                >
                  {user && user.email}
                </Text>
              </Flex>
              <Flex justify="space-between" w="100%" px="36px">
                <Flex flexDirection="column">
                  <Text
                    fontWeight="600"
                    color={mainText}
                    fontSize="xl"
                    textAlign="center"
                  >
                    17
                  </Text>
                  <Text color={secondaryText} fontWeight="500">
                    Posts
                  </Text>
                </Flex>
                <Flex flexDirection="column">
                  <Text
                    fontWeight="600"
                    color={mainText}
                    fontSize="xl"
                    textAlign="center"
                  >
                    9.7k
                  </Text>
                  <Text color={secondaryText} fontWeight="500">
                    Followers
                  </Text>
                </Flex>
                <Flex flexDirection="column">
                  <Text
                    fontWeight="600"
                    fontSize="xl"
                    color={mainText}
                    textAlign="center"
                  >
                    274
                  </Text>
                  <Text color={secondaryText} fontWeight="500">
                    Following
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
});

export default ProfileModal;
