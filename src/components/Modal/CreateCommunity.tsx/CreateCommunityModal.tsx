import { PhoneIcon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Divider,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Icon,
  RadioGroup,
  Radio,
  Flex,
} from "@chakra-ui/react";
import { BsEyeFill, BsFillPersonFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";
import { useState } from "react";
import { auth, firestore } from "@/src/firebase/clientApp";
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

type Props = {
  open: boolean;
  handleClose: () => void;
};

const CreateCommunityModal = (props: Props) => {
  const [user] = useAuthState(auth);
  const { open, handleClose } = props;
  const [communityName, setCommunityName] = useState("");
  const [remainingCharacters, setRemainingCharacters] = useState(21);
  const [communityType, setCommunityType] = useState("Public");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 21) return;
    setCommunityName(e.target.value);
    setRemainingCharacters(21 - e.target.value.length);
  };

  const handleSuccess = async () => {
    setSuccess(`Congrats ! r/${communityName} has been successfully created`);
  };

  const handleCreateCommunity = async () => {
    //validate the community
    setError("");
    setSuccess("");

    var format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (format.test(communityName)) {
      setError(
        "Community names must be between 3-21 characters, and can only contain letters, numbers and underscores"
      );
      return;
    }

    //create the commuity document in firestore
    //if valid name create community

    setLoading(true);

    try {
      const communityDocRef = doc(firestore, "communities", communityName);

      await runTransaction(firestore, async (transaction) => {
        //check that name not taken
        const communityDoc = await transaction.get(communityDocRef);
        if (communityDoc.exists()) {
          throw new Error(
            `Sorry r/${communityName} is already taken. Try another.`
          );
        }

        //create community
        transaction.set(communityDocRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          privacyType: communityType,
        });

        //add community snippet in userDoc

        //1.getCommunitySnippetDocRef -> user->user.uid->communitySnippet->communityName (coll->doc->coll->doc)

        const communitySnippetsDocRef = doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          communityName
        );
        transaction.set(communitySnippetsDocRef, {
          communityId: communityName,
          isModerator: true,
        });
      });
      handleSuccess();
    } catch (error: any) {
      console.log("handleCreateCommunity error", error);
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <>
      <Modal
        isOpen={open}
        onClose={() => {
          setError("");
          setSuccess("");
          setCommunityName("");
          setCommunityType("Public");
          setRemainingCharacters(21);
          handleClose();
        }}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display={"flex"}
            flexDirection="column"
            fontSize={15}
            padding={3}
          >
            Create a Community
          </ModalHeader>
          <ModalCloseButton />

          <Divider />
          <Box pl="3" py="3">
            <ModalBody display={"flex"} flexDir="column" p="0px 10px">
              <Text fontWeight={700} fontSize="15">
                Name
              </Text>
              <Text fontSize={11} color="gray.500">
                Community Names including capitalization cannot be changed
              </Text>
              <InputGroup size="sm" mt="1">
                <InputLeftElement pointerEvents="none">
                  <Text color="gray.500">r/</Text>
                </InputLeftElement>
                <Input
                  type="tel"
                  placeholder=""
                  onChange={handleChange}
                  value={communityName}
                />
              </InputGroup>
              <Text
                fontSize={"8pt"}
                color={!remainingCharacters ? "red" : "gray.500"}
              >
                {remainingCharacters} characters remainig
              </Text>
              <Text fontSize={"9pt"} color="red" py="1">
                {error}
              </Text>
              <Text fontSize={"9pt"} color="green" py="1">
                {success}
              </Text>
              <Box my="8">
                <Text fontWeight={700} fontSize="15" my="1">
                  Community Type{" "}
                  <Text as="span" fontSize={"9pt"} color="gray.500">
                    ({communityType})
                  </Text>
                </Text>
                <Stack>
                  <RadioGroup
                    onChange={(e) => setCommunityType(e)}
                    name="communityType"
                    defaultValue="Public"
                  >
                    <Stack direction="column">
                      <Radio value="Public" checked>
                        <Flex align="center">
                          <Icon as={BsFillPersonFill} color="gray.500" mr="2" />
                          <Text fontSize={"10pt"} mr="2">
                            Public
                          </Text>
                          <Text fontSize="8pt" color={"gray.500"}>
                            Anyone can view, post and comment in this community
                          </Text>
                        </Flex>
                      </Radio>
                      <Radio value="Restricted">
                        <Flex align="center">
                          <Icon as={BsEyeFill} color="gray.500" mr="2" />

                          <Text fontSize={"10pt"} mr="2">
                            Restricted
                          </Text>
                          <Text fontSize="8pt" color={"gray.500"}>
                            Anyone can view this community, only approved users
                            can post.
                          </Text>
                        </Flex>
                      </Radio>
                      <Radio value="Private">
                        <Flex align="center">
                          <Icon as={HiLockClosed} color="gray.500" mr="2" />

                          <Text fontSize={"10pt"} mr="2">
                            Private
                          </Text>
                          <Text fontSize="8pt" color={"gray.500"}>
                            Only approved users can view and post to this
                            community
                          </Text>
                        </Flex>
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </Stack>
              </Box>
            </ModalBody>
          </Box>

          <ModalFooter borderRadius={"0 0 5px 5px "} bg="gray.100">
            <Button
              colorScheme="blue"
              variant={"outline"}
              height={"28px"}
              mr={3}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              height={"28px"}
              isLoading={loading}
              onClick={handleCreateCommunity}
            >
              Create Community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateCommunityModal;
