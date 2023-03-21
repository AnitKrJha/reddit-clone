import { communityState } from "@/src/atoms/communitiesAtom";
import AboutCommunity from "@/src/components/Community/AboutCommunity";
import PageContentLayout from "@/src/components/Layout/PageContentLayout";
import NewPostForm from "@/src/components/Posts/NewPostForm";
import { auth } from "@/src/firebase/clientApp";
import { Box, Text } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";

type Props = {};

const SubmitPostsPage = (props: Props) => {
  const [user] = useAuthState(auth);
  const communityStateValue = useRecoilValue(communityState);
  return (
    <PageContentLayout>
      <>
        <Box padding="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text>Create a Post</Text>
        </Box>
        {user && <NewPostForm user={user} />}
      </>
      <>
        {/* <AboutCommunity communityData={communityStateValue.currentCommunity}/> */}
      </>
    </PageContentLayout>
  );
};

export default SubmitPostsPage;
