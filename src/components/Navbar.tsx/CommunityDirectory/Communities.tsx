import { communityState } from "@/src/atoms/communitiesAtom";
import { Box, Flex, Icon, MenuItem, Text } from "@chakra-ui/react";
import { useState } from "react";
import { FaReddit } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";
import { useRecoilValue } from "recoil";
import CreateCommunityModal from "../../Modal/CreateCommunity.tsx/CreateCommunityModal";
import MenuListItem from "./MenuListItem";

type Props = {};

const Communities = (props: Props) => {
  const [open, setOpen] = useState(false);
  const mySnippets = useRecoilValue(communityState).mySnippets;

  return (
    <>
      <CreateCommunityModal
        open={open}
        handleClose={() => {
          setOpen(false);
        }}
      />
      <Box>
        <Text pl="3" mb="1" fontSize="8pt" fontWeight={500} color="gray.500">
          Moderating
        </Text>

        {mySnippets
          .filter(({ isModerator }) => isModerator)
          .map((snippet) => {
            return (
              <MenuListItem
                key={snippet.communityId}
                displayText={`r/${snippet.communityId}`}
                link={`/r/${snippet.communityId}`}
                icon={FaReddit}
                iconColor={"blue.500"}
                imageURL={snippet.imageUrl}
              />
            );
          })}
      </Box>
      <Box>
        <Text pl="3" mb="1" fontSize="8pt" fontWeight={500} color="gray.500">
          My Communities
        </Text>
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
        {mySnippets.map((snippet) => {
          return (
            <MenuListItem
              key={snippet.communityId}
              displayText={`r/${snippet.communityId}`}
              link={`/r/${snippet.communityId}`}
              icon={FaReddit}
              iconColor={"blue.500"}
              imageURL={snippet.imageUrl}
            />
          );
        })}
      </Box>
    </>
  );
};

export default Communities;
