import { Button, Flex, Image, Stack } from "@chakra-ui/react";
import { useRef } from "react";

type Props = {
  selectedFile?: string;
  onSelectImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedTab: (arg: string) => void;
  setSelectedFile: (arg: string) => void;
};

const ImageUpload = (props: Props) => {
  const { onSelectImage, setSelectedFile, selectedFile, setSelectedTab } =
    props;
  const selectedFileRef = useRef<HTMLInputElement>(null);

  return (
    <Flex justify={"center"} align="center" w="full">
      {selectedFile ? (
        <Flex direction="column" justify={"center"} align="center">
          <Image src={selectedFile} maxHeight="400px" />
          <Stack direction="row" mt={4}>
            <Button
              height="28px"
              onClick={() => {
                setSelectedTab("Post");
              }}
            >
              Back To Post
            </Button>
            <Button
              height="28px"
              variant="outline"
              onClick={() => {
                setSelectedFile("");
              }}
            >
              Remove
            </Button>
          </Stack>
        </Flex>
      ) : (
        <Flex
          justify={"center"}
          align="center"
          w="full"
          p={20}
          border="1px solid"
          borderColor="gray.500"
          borderRadius={4}
          height="100px"
        >
          <Button
            variant={"outline"}
            height="30px"
            onClick={() => {
              selectedFileRef.current?.click();
            }}
          >
            Upload
          </Button>
          <input
            type="file"
            hidden
            ref={selectedFileRef}
            onChange={onSelectImage}
          />
        </Flex>
      )}
    </Flex>
  );
};

export default ImageUpload;
