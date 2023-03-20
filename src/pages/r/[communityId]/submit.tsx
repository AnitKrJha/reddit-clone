import PageContentLayout from "@/src/components/Layout/PageContentLayout";
import NewPostForm from "@/src/components/Posts/NewPostForm";
import { Box, Text } from "@chakra-ui/react";

type Props = {};

const SubmitPostsPage = (props: Props) => {
  return (
    <PageContentLayout>
      <>
        <Box padding="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text>Create a Post</Text>
        </Box>
        <NewPostForm />
      </>
      <>About Community</>
    </PageContentLayout>
  );
};

export default SubmitPostsPage;
