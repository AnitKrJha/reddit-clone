import { firestore } from "@/src/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { Community } from "@/src/atoms/communitiesAtom";
import safeJsonStringify from "safe-json-stringify";
import React from "react";
import CommunityNotFound from "@/src/components/Community/CommunityNotFound";
import Header from "@/src/components/Community/Header";
import PageContentLayout from "@/src/components/Layout/PageContentLayout";

type Props = {
  communityData: Community;
};

const CommunityPage = (props: Props) => {
  const { communityData } = props;

  if (!communityData) {
    return <CommunityNotFound />;
  }

  return (
    <>
      <Header communityData={communityData} />
      <PageContentLayout>
        <>
          <div>he</div>
          <div>he</div>
          <div>he</div>
          <div>he</div>
          <div>he</div>
        </>
        <>HEllo2</>
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
