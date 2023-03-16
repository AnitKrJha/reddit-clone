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
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/src/atoms/authModalAtom";
import { TiHome } from "react-icons/ti";
import Communities from "./Communities";

type Props = {
  user?: User | null;
};

const UserMenu = (props: Props) => {
  const { user } = props;

  const setAuthModalState = useSetRecoilState(authModalState);
  const [signOut, loading, error] = useSignOut(auth);

  return (
    <Menu>
      <MenuButton
        as={Button}
        isLoading={loading}
        mr={2}
        display='flex'
        alignItems={'center'}
        variant="ghost"
        rounded={"sm"}
        paddingX="1"
        _hover={{ bg: "gray.200" }}
        height={"32px"}
        gap="0"
        width={{base:'auto',lg:'200px'}}
        color="gray.800"
        rightIcon={<ChevronDownIcon marginLeft={{base:-2,lg:-1}} />}
        leftIcon={<Icon as={TiHome} mr={{base:"-1",lg:'-3'}} fontSize="20" />}
      >
        <Text display={{base:'none',lg:'flex'}} ml='2' >Home</Text>
      </MenuButton>
      <MenuList>
           
        <Communities/>

      </MenuList>
    </Menu>
  );
};

export default UserMenu;
