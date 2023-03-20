import { Flex } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

type Props = {};

const PageContentLayout = (props: PropsWithChildren<Props>) => {
  const { children } = props;

  console.log(children);

  return (
    <Flex justify="center" my="4">
      <Flex width="95%" maxWidth="860px" justify="center">
        {/* LHS */}
        <Flex
          direction="column"
          width={{ base: "100%", md: "65%" }}
          mr={{ base: 0, md: 6 }}
        >
          {children && children[0 as keyof typeof children]}
        </Flex>
        {/* RHS  */}
        <Flex
          direction="column"
          display={{ base: "none", md: "flex" }}
          flexGrow="1"
        >
          {children && children[1 as keyof typeof children]}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PageContentLayout;
