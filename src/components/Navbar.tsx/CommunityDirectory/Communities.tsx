import { Flex, Icon, MenuItem, Text } from "@chakra-ui/react";
import { useState } from "react";
import { GrAdd } from "react-icons/gr";
import CreateCommunityModal from "../../Modal/CreateCommunity.tsx/CreateCommunityModal";

type Props = {};

const Communities = (props: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CreateCommunityModal
        open={open}
        handleClose={() => {
          setOpen(false);
        }}
      />
      <MenuItem
        width={"100%"}
        fontSize="10px"
        _hover={{ bg: "gray.200" }}
        onClick={() => {
          setOpen(true);
        }}
      >
        <Flex alignItems={"center"} gap="2">
          <Icon as={GrAdd} fontSize="20" />
          <Text fontSize={"10pt"}>Create Community</Text>
        </Flex>
      </MenuItem>
    </>
  );
};

export default Communities;
