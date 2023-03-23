import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  writeBatch,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "../atoms/authModalAtom";
import {
  Community,
  CommunitySnippet,
  communityState,
} from "../atoms/communitiesAtom";
import { auth, firestore } from "../firebase/clientApp";

type Props = {};

const useCommunityData = (props?: Props) => {
  const [user] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const setAuthModalState = useSetRecoilState(authModalState);
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);

  const onJoinOrLeaveCommunity = (
    communityData: Community,
    isJoined: boolean
  ) => {
    //is the user Signed in?
    //accordingly auth modal

    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }
    joinCommunity(communityData);
  };

  const getMySnippets = async () => {
    setIsLoading(true);
    try {
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );

      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
      }));
    } catch (error: any) {
      setError(error.message);
      console.log("getMysnippetError", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!user) {
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [],
      }));
      return;
    }
    getMySnippets();
  }, [user]);

  const getCommunityData = async (communityId: string) => {
    // this causes weird memory leak error - not sure why
    // setLoading(true);
    console.log("GETTING COMMUNITY DATA");

    try {
      const communityDocRef = doc(
        firestore,
        "communities",
        communityId as string
      );
      const communityDoc = await getDoc(communityDocRef);
      // setCommunityStateValue((prev) => ({
      //   ...prev,
      //   visitedCommunities: {
      //     ...prev.visitedCommunities,
      //     [communityId as string]: {
      //       id: communityDoc.id,
      //       ...communityDoc.data(),
      //     } as Community,
      //   },
      // }));
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          id: communityDoc.id,
          ...communityDoc.data(),
        } as Community,
      }));
    } catch (error: any) {
      console.log("getCommunityData error", error.message);
    }
  };

  const joinCommunity = async (communityData: Community) => {
    //batched write
    // write the communuty Snippet in the user document
    //increase the number of members in the community
    setIsLoading(true);

    try {
      const batch = writeBatch(firestore);
      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageUrl: communityData.imageURL || "",
      };

      batch.set(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          communityData.id
        ),
        newSnippet
      );

      batch.update(doc(firestore, "communities", communityData.id), {
        numberOfMembers: increment(1),
      });

      await batch.commit();

      //update recoil state - communityState.mySnippets

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }));
    } catch (error: any) {
      console.log("joinCommunityError", error);
      setError(error.message);
    }
    setIsLoading(false);
  };

  const leaveCommunity = async (communityId: string) => {
    //batched write
    // delete the communuty Snippet in the user document
    //decrease the number of members in the community
    setIsLoading(true);

    try {
      const batch = writeBatch(firestore);

      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityId)
      );

      batch.update(doc(firestore, "communities", communityId), {
        numberOfMembers: increment(-1),
      });

      await batch.commit();

      //update recoil state - communityState.mySnippets

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (item) => item.communityId !== communityId
        ),
      }));
    } catch (error: any) {
      console.log("LeaveCommunityError", error);
      setError(error.message);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    // if (ssrCommunityData) return;
    const { communityId } = router.query;
    if (communityId) {
      const communityData = communityStateValue.currentCommunity;

      if (!communityData) {
        getCommunityData(communityId as string);
        return;
      }
      // console.log("this is happening", communityStateValue);
    }
  }, [router.query, communityStateValue.currentCommunity]);

  return {
    communityStateValue,
    onJoinOrLeaveCommunity,
    isLoading,
    error,
  };
};

export default useCommunityData;
