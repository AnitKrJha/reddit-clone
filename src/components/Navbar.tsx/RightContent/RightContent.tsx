import { auth } from "@/src/firebase/clientApp";
import { Button, Flex } from "@chakra-ui/react";
import { User } from "firebase/auth";
import React from "react";
import { useSignOut } from "react-firebase-hooks/auth";
import AuthModal from "../../Modal/Auth/AuthModal";
import AuthButtons from "./AuthButtons";
import Icons from "./Icons";
import UserMenu from "./UserMenu";

type Props = {
  user?: User|null;
};

const RightContent = (props: Props) => {
  const [signOut, loading, error] = useSignOut(auth);

  const { user } = props;
  return (
    <>
      <AuthModal />
      <Flex justify={"center"} align="center">
        {user ? (
         <Icons/>
        ) : (
          <AuthButtons />
        )}
        <UserMenu user={user}/>
      </Flex>
    </>
  );
};

export default RightContent;
