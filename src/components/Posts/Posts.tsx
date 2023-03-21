import { Community } from "@/src/atoms/communitiesAtom";
import { Post } from "@/src/atoms/postAtom";
import { auth, firestore } from "@/src/firebase/clientApp";
import usePosts from "@/src/hooks/usePosts";
import { Stack } from "@chakra-ui/react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import PostItem from "./PostItem";
import PostLoader from "./PostLoader";

type Props = {
  communityData: Community;
};

const Posts = ({ communityData }: Props) => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    postStateValue,
    setPostStateValue,
    onSelectPost,
    onDeletePost,
    onVote,
  } = usePosts();

  const getPosts = async () => {
    setLoading(true);
    try {
      //get post for this community

      const postQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communityData.id),
        orderBy("createdAt", "desc")
      );

      const postDocs = await getDocs(postQuery);

      const posts = postDocs.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      //store in posts state

      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));

      console.log({ posts });
    } catch (err: any) {
      setError(err.message);
      console.log("getposts error", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postStateValue.posts.map((post) => (
            <PostItem
              key={post.id}
              userIsCreator={user?.uid === post.creatorId}
              post={post}
              onDeletePost={onDeletePost}
              onSelectPost={onSelectPost}
              userVoteValue={undefined}
              onVote={onVote}
            />
          ))}
        </Stack>
      )}
    </>
  );
};

export default Posts;
