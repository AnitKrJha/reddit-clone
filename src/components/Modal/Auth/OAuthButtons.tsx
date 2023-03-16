import { Button, Flex, Image, Text } from "@chakra-ui/react";
import {useSignInWithGoogle} from "react-firebase-hooks/auth";
import {auth} from '../../../firebase/clientApp'

type Props = {};

const OAuthButtons = (props: Props) => {

  const [signInWithGoogle,user,loading,error]=useSignInWithGoogle(auth);  

  return (
    <Flex direction={"column"} width="100%" mb="4" gap={'2'}>
      <Button variant={"oauth"} isLoading={loading} onClick={()=>signInWithGoogle()}>
        <Image src="/images/googlelogo.png" height="20px" mr={2}/> Continue With
        Google
      </Button>
      <Button variant={"oauth"}>Some Other Provider</Button>
      {<Text>{error?.message}</Text>}
    </Flex>
  );
};

export default OAuthButtons;
