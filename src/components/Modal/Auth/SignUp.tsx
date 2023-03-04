import { authModalState } from '@/src/atoms/authModalAtom';
import { Input, Button, Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react'
import { useSetRecoilState } from 'recoil';

type Props = {}

const SignUp = (props: Props) => {
    const setAuthModalState = useSetRecoilState(authModalState);

    const [signUpForm, setSignUpForm] = useState({
      email: "",
      password: "",
      confirmPassword:''
    });
  
  
    //FireBase Logic
    const onSubmit = () => {};
  
  
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSignUpForm((prev) => ({
        ...prev,
        [e?.target.name]: e?.target.value,
      }));
    };
  
    return (
      <form action="" onSubmit={onSubmit}>
        <Input
          name="email"
          required
          placeholder="email"
          type="email"
          mb={2}
          onChange={onChange}
          fontSize="10pt"
          _placeholder={{ color: "gray.500" }}
          _hover={{
            bg: "white",
            border: "1px solid",
            borderColor: "blue.500",
          }}
          _focus={{
            outline: "none",
            bg: "white",
            border: "1px solid",
            borderColor: "blue.500",
          }}
          bg="gray.50"
        />
        <Input
          name="password"
          required
          placeholder="password"
          type="password"
          mb={2}
          onChange={onChange}
          fontSize="10pt"
          _placeholder={{ color: "gray.500" }}
          _hover={{
            bg: "white",
            border: "1px solid",
            borderColor: "blue.500",
          }}
          _focus={{
            outline: "none",
            bg: "white",
            border: "1px solid",
            borderColor: "blue.500",
          }}
          bg="gray.50"
        />
        <Input
          name="confirmPassword"
          required
          placeholder=" confirm password"
          type="password"
          mb={2}
          onChange={onChange}
          fontSize="10pt"
          _placeholder={{ color: "gray.500" }}
          _hover={{
            bg: "white",
            border: "1px solid",
            borderColor: "blue.500",
          }}
          _focus={{
            outline: "none",
            bg: "white",
            border: "1px solid",
            borderColor: "blue.500",
          }}
          bg="gray.50"
        />
        <Button width="100%" height="36px" mt={2} mb={2} type="submit">
          {" "}
          Sign Up
        </Button>
  
        <Flex fontSize={"9pt"} justifyContent="center">
          <Text mr={1}>Already a Redditer? </Text>
          <Text
            color="blue.500"
            fontWeight={700}
            cursor="pointer"
            onClick={() => {
              setAuthModalState((prev) => ({
                ...prev,
                view: "login",
              }));
            }}
          >
            LOGIN
          </Text>
        </Flex>
      </form>
    );
}

export default SignUp