import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  useRecoilState,
  useRecoilValue,
  useRecoilValue_TRANSITION_SUPPORT_UNSTABLE,
} from "recoil";
import { communityState } from "../atoms/communitiesAtom";
import { Post, postState, PostVote } from "../atoms/postAtom";
import { auth, firestore, storage } from "../firebase/clientApp";

type Props = {};

const usePosts = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const communityStateValue = useRecoilValue(communityState);

  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string
  ) => {
    event.stopPropagation();
    if (!user) {
      setError("Login first to vote on posts");
      return;
    }

    try {
      const { voteStatus } = post;
      const existingVote = postStateValue.postVotes.find(
        (vote) => vote.postId === post.id
      );

      const batch = writeBatch(firestore);
      let updatedPost = { ...post };
      let updatedPosts = [...postStateValue.posts];
      let updatedPostVotes = [...postStateValue.postVotes];
      let voteChange = vote;

      if (!existingVote) {
        //create a new postVote document
        const postVoteRef = doc(
          collection(firestore, `users`, `${user?.uid}/postVotes`)
        );
        const newVote: PostVote = {
          id: postVoteRef.id,
          postId: post.id!,
          communityId: communityId,
          voteValue: vote,
        };

        batch.set(postVoteRef, newVote);

        //add or subtract 1 from post.votestatus
        updatedPost.voteStatus = voteStatus + vote;
        updatedPostVotes = [...updatedPostVotes, newVote];
      }
      //existing vote- they have voted on the post before
      else {
        const postVoteRef = doc(
          firestore,
          `users`,
          `${user?.uid}/postVotes/${existingVote.id}`
        );

        //Removing the vote
        if (existingVote.voteValue === vote) {
          //add or subtract 1  from post.votestatus
          updatedPost.voteStatus = voteStatus - vote;
          updatedPostVotes = updatedPostVotes.filter(
            (vote) => vote.id !== existingVote.id
          );
          // delete the postVote document

          batch.delete(postVoteRef);

          voteChange *= -1;
        }
        //changing from upvote to downvote
        else {
          updatedPost.voteStatus = voteStatus + 2 * vote;

          const voteIdx = postStateValue.postVotes.findIndex(
            (vote) => vote.id === existingVote.id
          );

          //add or subtract 2 from post.votestatus
          updatedPostVotes[voteIdx] = {
            ...existingVote,
            voteValue: vote,
          };

          //updating the postVote document
          batch.update(postVoteRef, {
            voteValue: vote,
          });

          voteChange = 2 * vote;
        }
      }

      if (postStateValue.selectedPost) {
        setPostStateValue((prev) => {
          return { ...prev, selectedPost: updatedPost };
        });
      }

      const postRef = doc(firestore, "posts", post.id!);
      batch.update(postRef, { voteStatus: voteStatus + voteChange });
      await batch.commit();

      //update recoil state

      const postIdx = postStateValue.posts.findIndex(
        (item) => item.id === post.id
      );
      updatedPosts[postIdx] = updatedPost;

      setPostStateValue((prev) => {
        return { ...prev, posts: updatedPosts, postVotes: updatedPostVotes };
      });
    } catch (error) {
      console.log("vote error", error);
    }
  };

  const getCommunityPostVotes = async (communityId: string) => {
    const postVotesQuery = query(
      collection(firestore, `users/${user?.uid}/postVotes`),
      where("communityId", "==", communityId)
    );
    const postVoteDocs = await getDocs(postVotesQuery);
    const postVotes = postVoteDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPostStateValue((prev) => ({
      ...prev,
      postVotes: postVotes as PostVote[],
    }));
  };

  useEffect(() => {
    if (!user?.uid || !communityStateValue.currentCommunity) return;
    getCommunityPostVotes(communityStateValue.currentCommunity.id);
  }, [user, communityStateValue.currentCommunity]);

  const onSelectPost = (post: Post) => {
    setPostStateValue((prev) => ({
      ...prev,
      selectedPost: post,
    }));
    router.push(`/r/${post.communityId}/comments/${post.id}`);
  };

  const onDeletePost = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post
  ): Promise<boolean> => {
    event.stopPropagation();
    try {
      //check if there is an image ->delelte from firebase stoorage
      if (post.imageUrl) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }
      //delete post from fireStore

      const postDocRef = doc(firestore, `posts`, post.id!);
      await deleteDoc(postDocRef);

      //update recoil state

      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.id !== post.id),
      }));
      return true;
    } catch (error: any) {
      return false;
    }
  };

  useEffect(() => {
    // Logout or no authenticated user
    if (!user?.uid) {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
      return;
    }
  }, [user]);

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onDeletePost,
    onSelectPost,
    error,
    setError,
  };
};

export default usePosts;
