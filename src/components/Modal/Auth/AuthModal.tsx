import { authModalState } from "@/src/atoms/authModalAtom";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import AuthInputs from "./AuthInputs";
import OAuthButtons from "./OAuthButtons";

type Props = {};

const AuthModal = (props: Props) => {
  const [modalState, setModalState] = useRecoilState(authModalState);

  const handleClose = () => {
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <>
      <Modal isOpen={modalState.open} onClose={handleClose} >
        <ModalOverlay />
        <ModalContent marginInline='2' paddingBlock={2}>
          <ModalHeader textAlign="center">
            {modalState.view === "login" && "Login"}
            {modalState.view === "signup" && "Sign Up"}
            {modalState.view === "resetPassword" && "Reser Password"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Flex
              direction="column"
              align="center"
              justify={"center"}
              width="70%"
            >
              <OAuthButtons />
              <Flex width='100%' gap='2' align='center'>
                <Flex width='100%' height={'1px'} bg='gray.300'></Flex>
              <Text color={'gray.500'} fontWeight='700'> OR </Text>
                <Flex width='100%' height={'1px'} bg='gray.300'></Flex>
              </Flex>
              <AuthInputs />

              {/* <ResetPassword/>  */}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuthModal;
