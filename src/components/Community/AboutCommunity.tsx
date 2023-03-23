import { Community, communityState } from "@/src/atoms/communitiesAtom";
import { auth, firestore, storage } from "@/src/firebase/clientApp";
import useSelectedFile from "@/src/hooks/useSelectedFile";
import {
  Box,
  Flex,
  Text,
  Icon,
  Stack,
  Divider,
  Button,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { updateDoc, doc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaReddit } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import { useSetRecoilState } from "recoil";

type Props = {
  communityData: Community;
};

const AboutCommunity = ({ communityData }: Props) => {
  console.log("ccsdf", communityData);

  const [user] = useAuthState(auth);
  const selectedFileRef = useRef<HTMLInputElement>(null);
  const setCommunityStateValue = useSetRecoilState(communityState);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const { selectedFile, setSelectedFile, onSelectFile } = useSelectedFile();

  const onUpdateImage = async () => {
    if (!selectedFile) return;
    setUploadingImage(true);
    try {
      //get imageRef=>upload imge
      const imageRef = ref(storage, `communities/${communityData.id}/image`);
      await uploadString(imageRef, selectedFile, "data_url");
      const downloadURL = await getDownloadURL(imageRef);
      //update the community document with the imageURL
      await updateDoc(doc(firestore, "communities", communityData.id), {
        imageURL: downloadURL,
      });

      //update the recoil state
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          ...prev.currentCommunity,

          imageURL: downloadURL,
        } as Community,
      }));
    } catch (error: any) {
      console.log("uploadCommuityImage error", error);
      setError(error.message);
    }
    setUploadingImage(false);
  };
  return (
    <Box position={"sticky"} top="14px">
      <Flex
        justify="space-between"
        align="center"
        bg="blue.400"
        color="white"
        p={3}
        borderRadius="4px 4px 0 0"
      >
        <Text fontSize="10pt" fontWeight={700}>
          About Community
        </Text>
        <Icon as={HiOutlineDotsHorizontal} />
      </Flex>
      <Flex direction="column" p={3} bg="white" borderRadius="0px 0px 4px 4px">
        <Stack>
          <Flex width="full" padding="2" fontSize="10pt" fontWeight={700}>
            <Flex direction="column" flexGrow="1">
              <Text>{communityData.numberOfMembers.toLocaleString()}</Text>
              <Text>Members</Text>
            </Flex>
            <Flex direction="column" flexGrow="1">
              <Text>1</Text>
              <Text>Online</Text>
            </Flex>
          </Flex>
          <Divider />
          <Flex
            align="center"
            width="full"
            padding={1}
            fontWeight={500}
            fontSize="10pt"
          >
            <Icon as={RiCakeLine} mr={2} fontSize="18" />
            <Text>
              Created{" "}
              {moment(new Date(communityData.createdAt!.seconds * 1000)).format(
                "MMM DD YYYY"
              )}
            </Text>
          </Flex>
          <Link href={`/r/${communityData.id}/submit`}>
            <Button mt="3" height="30px" w="full">
              Create Post
            </Button>
          </Link>
          {user?.uid === communityData.creatorId && (
            <>
              <Divider bg="gray.400" color="gray.400" height={"1.5px"} />
              <Stack spacing="1" fontSize={"10pt"}>
                <Text fontWeight={600}>Admin</Text>
                <Flex align="center" justify={"space-between"}>
                  {communityData.imageURL || selectedFile ? (
                    <Image
                      src={selectedFile || communityData.imageURL}
                      borderRadius="full"
                      boxSize={"52px"}
                      alt="comm-image"
                    />
                  ) : (
                    <Icon
                      as={FaReddit}
                      fontSize="40"
                      color="brand.100"
                      mr={2}
                    />
                  )}
                  <Button
                    variant="link"
                    color="blue.500"
                    fontWeight={400}
                    onClick={() => {
                      selectedFileRef.current?.click();
                    }}
                  >
                    {" "}
                    Change Image
                    <input
                      type={"file"}
                      accept="image/x-png,image/gif,image/jpeg"
                      hidden
                      ref={selectedFileRef}
                      onChange={onSelectFile}
                    />
                  </Button>
                </Flex>
                <Divider />

                {selectedFile && (
                  <Flex align="center" justify="space-between" pt="10px">
                    <Button
                      cursor="pointer"
                      color="blue.600"
                      variant="link"
                      isLoading={uploadingImage}
                      onClick={onUpdateImage}
                      height="24px"
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant={"link"}
                      cursor="pointer"
                      onClick={() => {
                        setSelectedFile("");
                      }}
                    >
                      Cancel
                    </Button>
                  </Flex>
                )}
                {error && (
                  <Text fontSize="9pt" color="red">
                    {error}
                  </Text>
                )}
              </Stack>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};

export default AboutCommunity;
