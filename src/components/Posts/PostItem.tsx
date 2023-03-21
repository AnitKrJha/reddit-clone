import { Post } from "@/src/atoms/postAtom";
import { Flex, Icon, Stack, Text, Image, Skeleton } from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import { BsChat } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from "react-icons/io5";

type Props = {
  post: Post;
  userIsCreator: boolean;
  userVoteValue?: number;
  onVote: () => void;
  onDeletePost: () => void;
  onSelectPost: () => void;
};

const PostItem = (props: Props) => {
  const {
    post,
    userIsCreator,
    userVoteValue,
    onDeletePost,
    onVote,
    onSelectPost,
  } = props;

  const [imageLoading, setImageLoading] = React.useState(true);
  return (
    <Flex
      border="1px solid"
      bg="white"
      borderColor="gray.300"
      borderRadius="4"
      _hover={{ borderColor: "gray.500" }}
      cursor="pointer"
      onClick={onSelectPost}
    >
      <Flex
        direction="column"
        align="center"
        bg="gray.100"
        p="2"
        width="40px"
        borderRadius={4}
      >
        <Icon
          as={
            userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
          }
          color={userVoteValue === 1 ? "brand.100" : "gray.400"}
          fontSize="22pt"
          onClick={onVote}
          cursor="pointer"
          title="upVote this post"
        />
        <Text fontSize={"9pt"}>{post.voteStatus}</Text>
        <Icon
          as={
            userVoteValue === -1
              ? IoArrowDownCircleSharp
              : IoArrowDownCircleOutline
          }
          color={userVoteValue === -1 ? "#4379ff" : "gray.400"}
          fontSize="22pt"
          onClick={onVote}
          cursor="pointer"
          title="downVote this post"
        />
      </Flex>
      <Flex direction={"column"} width="full">
        <Stack spacing={1} p="10px">
          <Stack direction="row" spacing="0.6" fontSize="9pt">
            <Text fontWeight={600} color="black" mr={3}>
              r/{post.communityId}
            </Text>
            <Text>
              Posted by u/{post.creatorDisplayName}{" "}
              {moment(new Date(post.createdAt.seconds * 1000)).fromNow()}
            </Text>
          </Stack>
          <Text fontSize="12pt" fontWeight={600}>
            {post.title}
          </Text>
          <Text fontSize="10pt">{post.body}</Text>
          {post.imageUrl && (
            <Flex justify="center" align="center" p="2">
              {imageLoading && (
                <Skeleton height="200px" borderRadius={4} width="full" />
              )}
              <Image
                src={post.imageUrl}
                maxHeight="460px"
                alt="post image "
                display={imageLoading ? "none" : "auto"}
                onLoad={() => setImageLoading(false)}
              />
            </Flex>
          )}
        </Stack>
        <Flex ml={1} mb={0.5} color="gray.500" fontWeight="400">
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            cursor="pointer"
            _hover={{ bg: "gray.200" }}
          >
            <Icon as={BsChat} mr={2} />

            <Text fontSize="9pt">{post.numberOfComments}</Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            cursor="pointer"
            _hover={{ bg: "gray.200" }}
          >
            <Icon as={IoArrowRedoOutline} mr={2} />

            <Text fontSize="9pt">{"Share"}</Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            cursor="pointer"
            _hover={{ bg: "gray.200" }}
          >
            <Icon as={IoBookmarkOutline} mr={2} />

            <Text fontSize="9pt">{"Save"}</Text>
          </Flex>
          {userIsCreator && (
            <Flex
              align="center"
              p="8px 10px"
              borderRadius={4}
              cursor="pointer"
              color="red"
              _hover={{ bg: "gray.200" }}
            >
              <Icon as={AiOutlineDelete} mr={2} />

              <Text fontSize="9pt">{"Delete"}</Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PostItem;
