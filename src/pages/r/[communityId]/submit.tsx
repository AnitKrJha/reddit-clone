import PageContentLayout from "@/src/components/Layout/PageContentLayout";
import NewPostForm from "@/src/components/Posts/NewPostForm";
import { auth } from "@/src/firebase/clientApp";
import { Box, Text } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";

type Props = {};

const SubmitPostsPage = (props: Props) => {
  const [user] = useAuthState(auth);
  return (
    <PageContentLayout>
      <>
        <Box padding="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text>Create a Post</Text>
        </Box>
        {user && <NewPostForm user={user} />}
      </>
      <>About Community</>
    </PageContentLayout>
  );
};

export default SubmitPostsPage;
