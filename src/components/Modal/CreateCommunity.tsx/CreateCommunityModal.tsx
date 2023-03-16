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

type Props = {
  open: boolean;
  handleClose: () => void;
};

const CreateCommunityModal = (props: Props) => {
  const { open, handleClose } = props;
  const [communityName, setCommunityName] = useState("");
  const [remainingCharacters, setRemainingCharacters] = useState(21);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 21) return;

    setCommunityName(e.target.value);

    setRemainingCharacters(21 - e.target.value.length);
  };

  const [communityType, setCommunityType] = useState("Public");

  return (
    <>
      <Modal isOpen={open} onClose={handleClose}size='lg'>
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
          <Box pl="3" py='3'>
            <ModalBody display={"flex"} flexDir="column" p="0px 10px">
              <Text fontWeight={700} fontSize="15">
                Name
              </Text>
              <Text fontSize={11} color="gray.500">
                Community Names including capitalization cannot be changed
              </Text>
              <InputGroup size="sm" mt="1">
                <InputLeftElement
                  pointerEvents="none"
                  children={<Text color="gray.500">r/</Text>}
                />
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

              <Box my="8">
                <Text fontWeight={700} fontSize="15" my='1'>
                  Community Type
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
                          <Icon as={BsFillPersonFill} color='gray.500' mr='2'/>
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
                        <Icon as={BsEyeFill} color='gray.500' mr='2'/>

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
                        <Icon as={HiLockClosed} color='gray.500' mr='2'/>

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

          <ModalFooter borderRadius={'0 0 5px 5px '} bg='gray.100'>
            <Button
              colorScheme="blue"
              variant={"outline"}
              height={"28px"}
              mr={3}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button variant="solid" height={"28px"} onClick={()=>{}}>
              Create Community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateCommunityModal;
