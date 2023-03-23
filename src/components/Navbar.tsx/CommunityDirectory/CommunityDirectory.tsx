import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Icon,
  Flex,
  MenuDivider,
  Text,
  Image,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import React from "react";
import { VscAccount } from "react-icons/vsc";
import { FaRedditSquare } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLogin } from "react-icons/md";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "@/src/firebase/clientApp";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authModalState } from "@/src/atoms/authModalAtom";
import { TiHome } from "react-icons/ti";
import Communities from "./Communities";
import { communityState } from "@/src/atoms/communitiesAtom";
import useDirectory from "@/src/hooks/useDirectory";

type Props = {
  user?: User | null;
};

const UserMenu = (props: Props) => {
  const { user } = props;

  const setAuthModalState = useSetRecoilState(authModalState);
  const [signOut, loading, error] = useSignOut(auth);
  const { directoryState, toggleMenuOpen } = useDirectory();

  return (
    <Menu isOpen={directoryState.isOpen}>
      <MenuButton
        as={Button}
        isLoading={loading}
        mr={2}
        display="flex"
        alignItems={"center"}
        variant="ghost"
        rounded={"sm"}
        paddingX="1"
        onClick={toggleMenuOpen}
        _hover={{ bg: "gray.200" }}
        height={"32px"}
        gap="0"
        width={{ base: "auto", lg: "200px" }}
        color="gray.800"
        rightIcon={<ChevronDownIcon marginLeft={{ base: 0, lg: -1 }} />}
      >
        <Flex align={"center"}>
          {directoryState.seletedMenuItem.imageURL ? (
            <Image
              src={directoryState.seletedMenuItem.imageURL}
              borderRadius="full"
              boxSize={"25px"}
            />
          ) : (
            <Icon
              as={directoryState.seletedMenuItem.icon}
              mr={{ base: "0", lg: "0" }}
              fontSize="20"
            />
          )}
          <Text display={{ base: "none", lg: "flex" }} ml="2">
            {directoryState.seletedMenuItem.displayText}
          </Text>
        </Flex>
      </MenuButton>
      <MenuList>
        <Communities />
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
