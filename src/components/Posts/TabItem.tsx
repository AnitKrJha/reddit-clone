import { Flex, Text, Icon } from "@chakra-ui/react";
import React from "react";
import { TabItemType } from "./NewPostForm";

type Props = {
  item: TabItemType;
  selectedTab: boolean;
  setSelectedTab: (arg: string) => void;
};

const TabItem = (props: Props) => {
  const { item, selectedTab, setSelectedTab } = props;
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
      onClick={() => {
        setSelectedTab(item.title);
      }}
    >
      <Flex align="center" height="20px" mr="2">
        <Icon as={item.icon} fontWeight={"extrabold"} fontSize="16pt" />
      </Flex>
      <Text fontSize={"10pt"}>{item.title}</Text>
    </Flex>
  );
};

export default TabItem;
