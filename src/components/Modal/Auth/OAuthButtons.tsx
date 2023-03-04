import { Button, Flex, Image } from "@chakra-ui/react";
import React from "react";

type Props = {};

const OAuthButtons = (props: Props) => {
  return (
    <Flex direction={"column"} width="100%" mb="4" gap={'2'}>
      <Button variant={"oauth"}>
        <Image src="/images/googlelogo.png" height="20px" mr={2}/> Continue With
        Google
      </Button>
      <Button variant={"oauth"}>Some Other Provider</Button>
    </Flex>
  );
};

export default OAuthButtons;
