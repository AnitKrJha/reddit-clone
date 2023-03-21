import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { Post, postState } from "../atoms/postAtom";
import { firestore, storage } from "../firebase/clientApp";

type Props = {};

const usePosts = () => {
  const [postStateValue, setPostStateValue] = useRecoilState(postState);

  const onVote = async () => {};
  const onSelectPost = () => {};
  const onDeletePost = async (post: Post): Promise<boolean> => {
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

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onDeletePost,
    onSelectPost,
  };
};

export default usePosts;
