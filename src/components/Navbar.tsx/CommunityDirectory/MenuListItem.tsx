import useDirectory from "@/src/hooks/useDirectory";
import { Flex, Image, MenuItem, Icon } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons/lib";

type Props = {
  displayText: string;
  link: string;
  icon: IconType;
  iconColor: string;
  imageURL?: string;
};

const MenuListItem = ({
  displayText,
  link,
  icon,
  iconColor,
  imageURL,
}: Props) => {
  const { onSelectMenuItem } = useDirectory();

  return (
    <MenuItem
      width={"full"}
      fontSize="10pt"
      _hover={{ bg: "gray.100" }}
      onClick={() => {
        onSelectMenuItem({
          displayText,
          link,
          icon,
          iconColor,
          imageURL,
        });
      }}
    >
      <Flex align={"center"}>
        {imageURL ? (
          <Image src={imageURL} borderRadius="full" boxSize={"18px"} mr="2" />
        ) : (
          <Icon as={icon} fontSize="20" mr={2} color={iconColor} />
        )}
      </Flex>
      {displayText}
    </MenuItem>
  );
};

export default MenuListItem;
