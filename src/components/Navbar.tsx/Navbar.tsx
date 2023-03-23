import React from "react";
import { Flex, Image } from "@chakra-ui/react";
import SearchInput from "./SearchInput";
import RightContent from "./RightContent/RightContent";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "@/src/firebase/clientApp";
import CommunityDirectory from "./CommunityDirectory/CommunityDirectory";
import useDirectory from "@/src/hooks/useDirectory";
import { defaultMenuItem } from "@/src/atoms/directoryMenuItem";

type Props = {};

const Navbar = (props: Props) => {
  const [user, loading, error] = useAuthState(auth);
  const { onSelectMenuItem } = useDirectory();
  return (
    <Flex bg="white" height={"44px"} padding="6px 12px">
      <Flex
        align={"center"}
        mr={2}
        cursor="pointer"
        onClick={() => {
          onSelectMenuItem(defaultMenuItem);
        }}
      >
        <Image src="/images/redditFace.svg" height="30px" alt="reddit-logo" />
        <Image
          src="/images/redditText.svg"
          height="46px"
          alt="reddit-text-logo"
          display={{ base: "none", md: "unset" }}
        />
      </Flex>
      {user && <CommunityDirectory />}
      <SearchInput />
      <RightContent user={user} />
    </Flex>
  );
};

export default Navbar;
