import { Flex, Text, Icon } from "@chakra-ui/react";
import React from "react";
import { TiTick } from "react-icons/ti";
import { TabItemType } from "./NewPostForm";

type Props = {
  item: TabItemType;
  selectedTab: boolean;
  setSelectedTab: (arg: string) => void;
  fileSelected: boolean;
};

const TabItem = (props: Props) => {
  const { item, selectedTab, setSelectedTab, fileSelected } = props;
  return (
    <Flex
      justify="center"
      align="center"
      flexGrow={1}
      p="14px 0px"
      fontWeight={"700"}
      cursor="pointer"
      _hover={{ bg: "gray.50" }}
      color={selectedTab ? "blue.500" : "gray.500"}
      borderWidth={selectedTab ? "0px 1px 2px 0px" : "0px 1px 1px 0px"}
      borderBottomColor={selectedTab ? "blue.500" : "gray.200"}
      borderRightColor="gray.300"
      position="relative"
      onClick={() => {
        setSelectedTab(item.title);
      }}
    >
      {item.title === "Images & Video" && fileSelected && (
        <Icon
          as={TiTick}
          position="absolute"
          top="0.5"
          right="0.5"
          color="white"
          bg="green"
          outline="1px solid green"
          rounded={"full"}
        />
      )}
      <Flex align="center" height="20px" mr="2">
        <Icon as={item.icon} fontWeight={"extrabold"} />
      </Flex>
      <Text fontSize={"10pt"}>{item.title}</Text>
    </Flex>
  );
};

export default TabItem;
