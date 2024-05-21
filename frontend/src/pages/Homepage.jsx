import { useState } from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

const Homepage = () => {
  const navigate = useNavigate();

  const [isSelected, setIsSelected] = useState(true); // Set the initial state as true for the first tab

  const handleTabClick = (index) => {
    setIsSelected(index === 0); // Set isSelected to true if the first tab is clicked, false otherwise
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/chat");
    }
  }, [navigate]);
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="rgba(0, 4, 4, 0.6)"
        color={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        border={"1px solid #666777"}
      >
        <Text fontSize="3xl" textAlign="center">
          Chatopia
        </Text>
      </Box>
      <Box
        bg="rgba(0, 4, 4, 0.6)"
        color={"white"}
        w="100%"
        p={4}
        borderRadius="lg"
        borderWidth="1px"
        border={"1px solid #666777"}
      >
        <Tabs variant="enclosed">
          <TabList mb="1em">
            <Tab
              _selected={{ color: "white", bg: "rgba(16, 8, 111, 0.7)" }}
              width="50%"
              color={isSelected ? "white" : "#666777"}
              onClick={() => handleTabClick(0)} // Handle click on the first tab
            >
              Login
            </Tab>
            <Tab
              width="50%"
              _selected={{ color: "white", bg: "rgba(16, 8, 111, 0.7)" }}
              color={isSelected ? "#666777" : "white"}
              onClick={() => handleTabClick(1)} // Handle click on the second tab
            >
              Sign Up!
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
