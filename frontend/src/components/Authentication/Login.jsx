import {
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  VStack,
  Input,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const isSiginpDisabled = !email || !password;
  const toast = useToast();
  const navigate = useNavigate();
  const handleClick = () => {
    setShow(!show);
  };
  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Fill all the fields",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/login",
        {
          email,
          password,
        },
        config,
      );
      toast({
        title: "Logg In Successful",
        description: "Let's Chat!",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      console.log(data);

      localStorage.setItem("userInfo", JSON.stringify(data)); // The data (email, name, token) is stored in the local storage
      setLoading(false);
      navigate("/chat");
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });

      console.log(error);
      setLoading(false);
    }
  };
  return (
    <VStack backdropFilter="blur(4px)" borderRadius="3%" spacing="5px">
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          autoComplete="off"
          style={{
            border: "1px solid rgba(102, 103, 119, 0.5)",
            borderRadius: "5px",
          }}
          type="email"
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        ></Input>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            autoComplete="off"
            style={{
              border: "1px solid rgba(102, 103, 119, 0.5)",
              borderRadius: "5px",
            }}
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
          <InputRightElement width="4.5rem">
            <Button
              bg="transparent"
              _hover={{ bg: "rgba(0, 4, 4, 0.5)" }}
              color={"#666777"}
              h="1.75rem"
              size="sm"
              onClick={handleClick}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        variant={"outline"}
        width={"100%"}
        color={"white"}
        bg={"rgba(16, 8, 111, 0.7)"}
        _hover={{ bg: "rgba(0, 0, 255, 0.09)" }}
        border={"1px solid #666777"}
        mt={4}
        style={{ marginTop: 10 }}
        isDisabled={isSiginpDisabled}
        onClick={submitHandler}
      >
        Sign In!
      </Button>
    </VStack>
  );
}

export default Login;
