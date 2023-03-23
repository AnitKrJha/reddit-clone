import { Post } from "@/src/atoms/postAtom";
import {
  Flex,
  Icon,
  Stack,
  Text,
  Image,
  Skeleton,
  Spinner,
} from "@chakra-ui/react";
import moment from "moment";
import React, { useState } from "react";
import {
  BsChat,
  BsDot,
  BsExclamation,
  BsExclamationCircleFill,
} from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from "react-icons/io5";
import { CgClose } from "react-icons/cg";
import { useRouter } from "next/router";
import { FaReddit } from "react-icons/fa";
import Link from "next/link";

type Props = {
  post: Post;
  userIsCreator: boolean;
  userVoteValue?: number;
  onVote: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    a: Post,
    vote: number,
    commid: string
  ) => Promise<void>;
  onDeletePost: (
    event: React.MouseEvent<any | MouseEvent>,
    a: Post
  ) => Promise<boolean>;
  onSelectPost?: (a: Post) => void;
  error?: any;
  setError?: any;
};

const PostItem = (props: Props) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const router = useRouter();
  const handleDelete = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setDeleteInProgress(true);
    try {
      const success = await onDeletePost(event, post);
      if (!success) {
        throw new Error("Failed to Delete Post");
      }

      if (!onSelectPost) {
        router.push(`/r/${post.communityId}`);
      }
    } catch (err: any) {
      setError(err.message);
    }

    setDeleteInProgress(false);
  };

  const {
    post,
    userIsCreator,
    userVoteValue,
    onDeletePost,
    onVote,
    onSelectPost,
    error,
    setError,
  } = props;

  return (
    <Flex
      border="1px solid"
      bg={error ? "red.50" : "white"}
      borderColor="gray.300"
      borderRadius={onSelectPost ? "4" : "4px 4px 0 0"}
      _hover={{ borderColor: onSelectPost ? "gray.500" : "none" }}
      cursor="pointer"
      borderBottom={!onSelectPost ? "none" : ""}
      onClick={() => {
        onSelectPost && onSelectPost(post);
      }}
    >
      <Flex
        direction="column"
        align="center"
        bg={onSelectPost ? "gray.100" : "white"}
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
          onClick={(e) => {
            onVote(e, post, 1, post.communityId);
          }}
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
          onClick={(e) => {
            onVote(e, post, -1, post.communityId);
          }}
          cursor="pointer"
          title="downVote this post"
        />
      </Flex>
      <Flex direction={"column"} width="full">
        {error && (
          <Text
            fontSize="10pt"
            borderBottom="1px solid red"
            color="red "
            w="full"
            p="5px 10px"
            bg="red.100"
            display="flex"
            align="center"
            gap="10px"
          >
            <Icon as={BsExclamationCircleFill} alignSelf="center" />
            <Text>{error}</Text>
            <Icon
              as={CgClose}
              alignSelf="center"
              ml="auto"
              onClick={(e) => {
                e.stopPropagation();
                setError("");
              }}
              fontSize="12pt"
              p="2px"
              _hover={{ bg: "red.50" }}
            />
          </Text>
        )}
        <Stack spacing={1} p="10px">
          <Stack direction="row" spacing="0.6" fontSize="9pt" align="center">
            {post.communityImageURL ? (
              <Image
                src={post.communityImageURL}
                borderRadius="full"
                boxSize="18px"
                mr={2}
              />
            ) : (
              <Icon as={FaReddit} fontSize="16pt" mr={1} color="blue.500" />
            )}
            <Link
              href={`/r/${post.communityId}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Text
                fontWeight={600}
                color="black"
                mr={0}
                _hover={{ textDecor: "underline" }}
              >
                r/{post.communityId}
              </Text>
            </Link>
            <Icon as={BsDot} />
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
              onClick={handleDelete}
            >
              {deleteInProgress ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <Icon as={AiOutlineDelete} mr={2} />

                  <Text fontSize="9pt">{"Delete"}</Text>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PostItem;
