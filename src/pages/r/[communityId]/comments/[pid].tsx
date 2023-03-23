import { Post } from "@/src/atoms/postAtom";
import AboutCommunity from "@/src/components/Community/AboutCommunity";
import PageContentLayout from "@/src/components/Layout/PageContentLayout";
import Comments from "@/src/components/Posts/comments/Comments";
import PostItem from "@/src/components/Posts/PostItem";
import { auth, firestore } from "@/src/firebase/clientApp";
import useCommunityData from "@/src/hooks/useCommunityData";
import usePosts from "@/src/hooks/usePosts";
import { doc, getDoc } from "firebase/firestore";
import router, { useRouter } from "next/router";
import { pid } from "process";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

type Props = {};

const PostPage = (props: Props) => {
  const {
    setPostStateValue,
    postStateValue,
    onDeletePost,
    error,
    setError,
    onVote,
  } = usePosts();

  const [user] = useAuthState(auth);
  const { communityStateValue } = useCommunityData();
  const router = useRouter();
  const { communityId, pid } = router.query;
  const fetchPost = async () => {
    console.log("FETCHING POST");

    try {
      const postDocRef = doc(firestore, "posts", pid as string);
      const postDoc = await getDoc(postDocRef);
      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
      }));
      // setPostStateValue((prev) => ({
      //   ...prev,
      //   selectedPost: {} as Post,
      // }));
    } catch (error: any) {
      console.log("fetchPost error", error.message);
    }
  };

  // Fetch post if not in already in state
  useEffect(() => {
    const { pid } = router.query;

    if (pid && !postStateValue.selectedPost) {
      fetchPost();
    }
  }, [router.query, postStateValue.selectedPost]);

  return (
    <PageContentLayout>
      <>
        {postStateValue.selectedPost && (
          <PostItem
            error={error}
            setError={error}
            post={postStateValue.selectedPost}
            onVote={onVote}
            onDeletePost={onDeletePost}
            userVoteValue={
              postStateValue.postVotes.find(
                (item) => item.postId === postStateValue.selectedPost?.id
              )?.voteValue
            }
            userIsCreator={user?.uid === postStateValue.selectedPost?.creatorId}
          />
        )}
        <Comments
          communityId={communityId as string}
          selectedPost={postStateValue.selectedPost!}
          user={user}
        />
      </>
      <>
        {communityStateValue.currentCommunity && (
          <AboutCommunity
            communityData={communityStateValue.currentCommunity}
          />
        )}
      </>
    </PageContentLayout>
  );
};

export default PostPage;
