import { authModalState } from "@/src/atoms/authModalAtom";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { FIREBASE_ERRORS } from "@/src/firebase/errors";
import {
  Input,
  Button,
  Flex,
  Text,
  Alert,
  CloseButton,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { auth } from "@/src/firebase/clientApp";

type Props = {};

const SignUp = (props: Props) => {
  const [parent, enableAnimations] = useAutoAnimate();
  const setAuthModalState = useSetRecoilState(authModalState);
  const [error, setError] = useState("");
  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [createUserWithEmailAndPassword, user, loading, userError] =
    useCreateUserWithEmailAndPassword(auth);

  //FireBase Logic
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (error) setError("");

    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError("Passwords Do not Match");
      return;
    }
    try {
      createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev) => ({
      ...prev,
      [e?.target.name]: e?.target.value,
    }));
  };

  return (
    <form onSubmit={onSubmit} ref={parent}>
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

      {(error || userError) && (
        <Alert
          status="error"
          py={0}
          borderRadius="2px"
          border="1px solid red"
          bg="red.50"
          color="red.500"
          mt={4}
        >
          <AlertIcon />

          <AlertDescription fontSize={"10pt"}>
            {error ||
              FIREBASE_ERRORS[
                userError?.message as keyof typeof FIREBASE_ERRORS
              ]}
          </AlertDescription>
        </Alert>
      )}

      <Button
        width="100%"
        height="36px"
        mt={2}
        mb={2}
        type="submit"
        isLoading={loading}
      >
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
};

export default SignUp;
