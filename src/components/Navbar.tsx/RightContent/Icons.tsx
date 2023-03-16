import { Flex, Icon } from "@chakra-ui/react";
import React from "react";
import { BsArrowUpRightCircle, BsChatDots } from "react-icons/bs";
import {
  IoVideocamOutline,
  IoFilterCircleOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import { GrAdd } from "react-icons/gr";

type Props = {};

const Icons = (props: Props) => {
  return (
    <>
      <Flex>
        <Flex
          display={{ base: "none", md: "flex" }}
          align="center"
          borderRight={"2px solid"}
          borderColor="gray.300"
        >
          <Flex
            mx="1.5"
            p="1"
            cursor={"pointer"}
            borderRadius="4"
            _hover={{ bg: "gray.200" }}
          >
            <Icon as={BsArrowUpRightCircle} fontSize="20" />
          </Flex>
          <Flex
            mx="1.5"
            p="1"
            cursor={"pointer"}
            borderRadius="4"
            _hover={{ bg: "gray.200" }}
          >
            <Icon as={IoFilterCircleOutline} fontSize="22" />
          </Flex>
          <Flex
            mx="1.5"
            p="1"
            cursor={"pointer"}
            borderRadius="4"
            _hover={{ bg: "gray.200" }}
          >
            <Icon as={IoVideocamOutline} fontSize="22" />
          </Flex>
        </Flex>
        <>
          <Flex
            mx="1.5"
            p="1"
            cursor={"pointer"}
            borderRadius="4"
            _hover={{ bg: "gray.200" }}
          >
            <Icon as={BsChatDots} fontSize="20" />
          </Flex>
          <Flex
            mx="1.5"
            p="1"
            cursor={"pointer"}
            borderRadius="4"
            _hover={{ bg: "gray.200" }}
          >
            <Icon as={IoNotificationsOutline} fontSize="20" />
          </Flex>
          <Flex
            mx="1.5"
            p="1"
            cursor={"pointer"}
            borderRadius="4"
            display={{ base: "none", md: "flex" }}
            _hover={{ bg: "gray.200" }}
          >
            <Icon as={GrAdd} fontSize="20" />
          </Flex>
        </>
      </Flex>
    </>
  );
};

export default Icons;
