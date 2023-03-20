import { authModalState } from "@/src/atoms/authModalAtom";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Flex,
  Input,
  Text,
} from "@chakra-ui/react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import React, { FormEvent, useState } from "react";
import { auth } from "@/src/firebase/clientApp";
import { FIREBASE_ERRORS } from "@/src/firebase/errors";

type Props = {};

const Login = (props: Props) => {
  const setAuthModalState = useSetRecoilState(authModalState);

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  //FireBase Logic
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signInWithEmailAndPassword(loginForm.email, loginForm.password);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
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
      <Button
        isLoading={loading}
        width="100%"
        height="36px"
        mt={2}
        mb={2}
        type="submit"
      >
        {" "}
        Login
      </Button>
      {error && (
        <Alert
          status="error"
          py={0}
          borderRadius="2px"
          border="1px solid red"
          my={2}
          bg="red.50"
          color="red.500"
          mt={4}
        >
          <AlertIcon />

          <AlertDescription fontSize={"10pt"}>
            {FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
          </AlertDescription>
        </Alert>
      )}
      <Flex fontSize={"9pt"} justifyContent="center">
        <Text mr={1}>Forgot Password?</Text>
        <Text
          color="red.500"
          fontWeight={500}
          cursor="pointer"
          onClick={() => {
            setAuthModalState((prev) => ({
              ...prev,
              view: "resetPassword",
            }));
          }}
        >
          Reset Password
        </Text>
      </Flex>
      <Flex fontSize={"9pt"} justifyContent="center">
        <Text mr={1}>New Here?</Text>
        <Text
          color="blue.500"
          fontWeight={700}
          cursor="pointer"
          onClick={() => {
            setAuthModalState((prev) => ({
              ...prev,
              view: "signup",
            }));
          }}
        >
          SIGN UP
        </Text>
      </Flex>
    </form>
  );
};

export default Login;
