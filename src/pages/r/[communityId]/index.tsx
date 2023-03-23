import { auth, firestore } from "@/src/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { Community, communityState } from "@/src/atoms/communitiesAtom";
import safeJsonStringify from "safe-json-stringify";
import { useEffect } from "react";
import CommunityNotFound from "@/src/components/Community/CommunityNotFound";
import Header from "@/src/components/Community/Header";
import PageContentLayout from "@/src/components/Layout/PageContentLayout";
import CreatePostLink from "@/src/components/Community/CreatePostLink";
import Posts from "@/src/components/Posts/Posts";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import AboutCommunity from "@/src/components/Community/AboutCommunity";

type Props = {
  communityData: Community;
};

const CommunityPage = (props: Props) => {
  const { communityData } = props;
  console.log(communityData);

  const setCommunityStateValue = useSetRecoilState(communityState);

  useEffect(() => {
    setCommunityStateValue((prev) => ({
      ...prev,
      currentCommunity: communityData,
    }));
  }, [communityData]);

  if (!communityData) {
    return <CommunityNotFound />;
  }

  return (
    <>
      <Header communityData={communityData} />
      <PageContentLayout>
        <>
          <CreatePostLink />
          <Posts communityData={communityData} />
        </>
        <>
          <AboutCommunity communityData={communityData} />
        </>
      </PageContentLayout>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  //get community data and pass it to client

  try {
    const communityDocRef = doc(
      firestore,
      "communities",
      context.query.communityId as string
    );

    const communityDoc = await getDoc(communityDocRef);

    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
            )
          : "",
      },
    };
  } catch (err: any) {
    console.log({ getServerSidePropsError: err });
  }
}

export default CommunityPage;
