import { Post, postState } from "@/src/atoms/postAtom";
import {
  Box,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import {
  writeBatch,
  doc,
  collection,
  serverTimestamp,
  Timestamp,
  increment,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "@/src/firebase/clientApp";
import CommentInput from "./CommentInput";
import { useSetRecoilState } from "recoil";
import CommentItem from "./CommentItem";

type Props = {
  user?: User | null;
  selectedPost: Post;
  communityId: string;
};

export type Comment = {
  id: string;
  creatorId?: string;
  creatorDisplayText?: string;
  communityId: string;
  postId: string;
  postTitle: string;
  text: string;
  createdAt: Timestamp;
};

const Comments = ({ user, selectedPost, communityId }: Props) => {
  const setPostState = useSetRecoilState(postState);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);

  const [loadingDeleteId, setLoadingDeleteId] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  const onCreateComment = async () => {
    setCreateLoading(true);
    try {
      const batch = writeBatch(firestore);

      // create a comment document
      const commentDocRef = doc(collection(firestore, "comments"));

      const newComment: Comment = {
        id: commentDocRef.id,
        creatorId: user?.uid,
        creatorDisplayText: user?.email!.split("@")[0],
        communityId,
        postId: selectedPost?.id!,
        postTitle: selectedPost?.title!,
        text: commentText,
        createdAt: serverTimestamp() as Timestamp,
      };

      batch.set(commentDocRef, newComment);

      newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;

      // update post numberOfComments +1
      const postDocRef = doc(firestore, "posts", selectedPost?.id!);
      batch.update(postDocRef, {
        numberOfComments: increment(1),
      });

      await batch.commit();

      // update client recoil state
      setCommentText("");
      setComments((prev) => [newComment, ...prev]);
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! + 1,
        } as Post,
      }));
    } catch (error) {
      console.log("onCreateComment error", error);
    }
    setCreateLoading(false);
  };
  const onDeleteComment = async (comment: Comment) => {
    setLoadingDeleteId(comment.id);
    try {
      const batch = writeBatch(firestore);

      // delete comment document
      const commentDocRef = doc(firestore, "comments", comment.id);
      batch.delete(commentDocRef);

      // update post numberOfComments -1
      const postDocRef = doc(firestore, "posts", selectedPost?.id!);
      batch.update(postDocRef, {
        numberOfComments: increment(-1),
      });

      await batch.commit();

      // update client recoil state
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! - 1,
        } as Post,
      }));

      setComments((prev) => prev.filter((item) => item.id !== comment.id));
    } catch (error) {
      console.log("onDeleteComment error", error);
    }
    setLoadingDeleteId("");
  };
  const getPostComment = async () => {
    setFetchLoading(true);

    try {
      const commentsQuery = query(
        collection(firestore, "comments"),
        where("postId", "==", selectedPost?.id),
        orderBy("createdAt", "desc")
      );
      const commentDocs = await getDocs(commentsQuery);
      const comments = commentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(comments as Comment[]);
    } catch (error) {
      console.log("getPostComments error", error);
    }
    setFetchLoading(false);
  };

  useEffect(() => {
    console.log("running");
    if (!selectedPost) return;
    getPostComment();
  }, [selectedPost]);

  return (
    <Box
      bg="white"
      borderRadius="0px 0px 4px 4px"
      p="2"
      border="1px solid"
      borderColor={"gray.300"}
      borderTop="none"
    >
      <Flex
        direction={"column"}
        pl="10"
        pr="4"
        mb="6"
        fontSize={"10pt"}
        width="full"
      >
        {!fetchLoading && (
          <CommentInput
            commentText={commentText}
            createLoading={createLoading}
            onCreateComment={onCreateComment}
            setCommentText={setCommentText}
            user={user}
          />
        )}
      </Flex>
      <Stack spacing={6} p={2}>
        {fetchLoading ? (
          <>
            {[0, 1, 2].map((item) => (
              <Box key={item} padding="6" bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={2} spacing="4" />
              </Box>
            ))}
          </>
        ) : (
          <>
            {comments.length === 0 ? (
              <Flex
                direction="column"
                justify="center"
                align="center"
                borderTop="1px solid"
                borderColor="gray.100"
                p={20}
              >
                {!fetchLoading && (
                  <Text fontWeight={700} opacity={0.3}>
                    No Comments Yet
                  </Text>
                )}
              </Flex>
            ) : (
              <>
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onDeleteComment={onDeleteComment}
                    loadingDelete={loadingDeleteId === comment.id}
                    userId={user!.uid}
                  />
                ))}
              </>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};

export default Comments;
