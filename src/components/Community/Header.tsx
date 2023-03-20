import { Community } from "@/src/atoms/communitiesAtom";
import useCommunityData from "@/src/hooks/useCommunityData";
import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import React from "react";
import { FaReddit } from "react-icons/fa";

type Props = {
  communityData: Community;
};

const Header = (props: Props) => {
  const { communityData } = props;

  const { onJoinOrLeaveCommunity, communityStateValue, isLoading } =
    useCommunityData();
  const isJoined = !!communityStateValue.mySnippets.find(
    (item) => item.communityId === communityData.id
  ); //read from community snippets

  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="50%" bg="blue.400" />
      <Flex justify="center" flexGrow="1" bg="white">
        <Flex width="95%" maxWidth="860px">
          {communityData.imageUrl ? (
            <Image />
          ) : (
            <Icon
              as={FaReddit}
              position="relative"
              fontSize="64"
              top="-3"
              color="brand.100"
              border="solid 4px white"
              borderRadius="full"
            />
          )}

          <Flex padding="10px 16px">
            <Flex direction="column" mr="6">
              <Text fontWeight="800" fontSize="16pt">
                {communityData.id}
              </Text>
              <Text fontWeight="600" fontSize="10pt" color="gray.400">
                r/{communityData.id}
              </Text>
            </Flex>
            <Button
              variant={isJoined ? "outline" : "solid"}
              height="30px"
              paddingX="6"
              isLoading={isLoading}
              onClick={() => {
                onJoinOrLeaveCommunity(communityData, isJoined);
              }}
            >
              {isJoined ? "Joined" : "Join"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Header;
