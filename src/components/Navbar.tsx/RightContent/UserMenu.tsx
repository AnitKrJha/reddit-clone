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
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import React from "react";
import { VscAccount } from "react-icons/vsc";
import { FaRedditSquare } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLogin } from "react-icons/md";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "@/src/firebase/clientApp";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "@/src/atoms/authModalAtom";
import { IoSparkles } from "react-icons/io5";
import { communityState } from "@/src/atoms/communitiesAtom";

type Props = {
  user?: User | null;
};

const UserMenu = (props: Props) => {
  const { user } = props;

  const setAuthModalState = useSetRecoilState(authModalState);
  const [signOut, loading, error] = useSignOut(auth);
  const resetCommunityData = useResetRecoilState(communityState);
  return (
    <Menu>
      <MenuButton
        as={Button}
        isLoading={loading}
        variant="ghost"
        rounded={"sm"}
        paddingX="1"
        _hover={{ bg: "gray.200" }}
        height={"32px"}
        gap="0"
        color="gray.500"
        rightIcon={<ChevronDownIcon marginLeft={0} />}
        leftIcon={
          <Icon as={user ? FaRedditSquare : VscAccount} mr="0" fontSize="22" />
        }
      >
        {user && (
          <Flex
            direction={"column"}
            gap="1"
            display={{ base: "none", sm: "flex" }}
            align="start"
          >
            <Text>{user?.displayName || user?.email?.split("@")[0]}</Text>
            <Flex justify={"space-around"}>
              <Icon as={IoSparkles} mr={1} color="brand.100"></Icon>
              <Text fontSize={"8pt"} color="gray.400">
                1 karma
              </Text>
            </Flex>
          </Flex>
        )}
      </MenuButton>
      <MenuList>
        {user ? (
          <>
            {" "}
            <MenuItem
              fontSize={"10pt"}
              fontWeight="700"
              _hover={{ bg: "blue.500", textColor: "white" }}
            >
              <Flex align="center">
                <Icon as={CgProfile} mr="2" fontSize={20} />
                Profile
              </Flex>
            </MenuItem>
            <MenuDivider />
            <MenuItem
              fontSize={"10pt"}
              fontWeight="700"
              _hover={{ bg: "blue.500", textColor: "white" }}
              onClick={async () => {
                await signOut();
                // resetCommunityData();
              }}
            >
              <Flex align="center">
                <Icon as={MdOutlineLogin} mr="2" fontSize={20} />
                Log Out
              </Flex>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem
              fontSize={"10pt"}
              fontWeight="700"
              _hover={{ bg: "blue.500", textColor: "white" }}
              onClick={() => {
                setAuthModalState((p) => ({ ...p, open: true, view: "login" }));
              }}
            >
              <Flex align="center">
                <Icon as={MdOutlineLogin} mr="2" fontSize={20} />
                Log In / Sign Up
              </Flex>
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
