import { Button, Flex, Input, Stack, Text, Textarea } from "@chakra-ui/react";
import React from "react";

type Props = {
  textInputs: {
    title: string;
    body: string;
  };
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleCreatePost: () => void;
  loading: boolean;
  error?: string;
  success?: string;
};

const TextInputs = (props: Props) => {
  const { textInputs, onChange, handleCreatePost, loading, error, success } =
    props;

  return (
    <Stack spacing={3} width="full">
      <Input
        name="title"
        value={textInputs.title}
        onChange={onChange}
        fontSize="10pt"
        borderRadius={4}
        placeholder={"Title"}
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "white",
        }}
      />
      <Textarea
        name="body"
        value={textInputs.body}
        onChange={onChange}
        fontSize="10pt"
        borderRadius={4}
        rows={6}
        placeholder={"Text (optional)"}
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "white",
        }}
      />
      <Flex w="full" justifyContent={"end"}>
        <Button
          height={"30px"}
          padding="0px 30px"
          isDisabled={!textInputs.title}
          onClick={handleCreatePost}
          isLoading={loading}
        >
          Post
        </Button>
      </Flex>
      {error && (
        <Text color="red" fontSize="9pt">
          {error}
        </Text>
      )}
      {success && (
        <Text color="green" fontSize="9pt">
          {success}
        </Text>
      )}
    </Stack>
  );
};

export default TextInputs;
