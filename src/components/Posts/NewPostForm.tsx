import { Post } from "@/src/atoms/postAtom";
import { firestore, storage } from "@/src/firebase/clientApp";
import useSelectedFile from "@/src/hooks/useSelectedFile";
import { Flex, Icon } from "@chakra-ui/react";
import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useRouter } from "next/router";
import { useState } from "react";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { CgPoll } from "react-icons/cg";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import ImageUpload from "./PostForm/ImageUpload";
import TextInputs from "./PostForm/TextInputs";
import TabItem from "./TabItem";

type Props = {
  user: User;
};

const formTabs: TabItemType[] = [
  { title: "Post", icon: IoDocumentText },
  { title: "Images & Video", icon: IoImageOutline },
  { title: "Link", icon: BsLink45Deg },
  { title: "Poll", icon: CgPoll },
  { title: "Talk", icon: BsMic },
];

export type TabItemType = {
  title: string;
  icon: typeof Icon.arguments;
};

const NewPostForm = ({ user }: Props) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
  });
  const { selectedFile, setSelectedFile, onSelectFile } = useSelectedFile();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreatePost = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    const { communityId } = router.query;

    //create newPost object of type Post
    const newPost: Post = {
      communityId: communityId as string,
      creatorId: user?.uid,
      creatorDisplayName: user.displayName || user.email!.split("@")[0],
      title: textInputs.title,
      body: textInputs.body,
      createdAt: serverTimestamp() as Timestamp,
      numberOfComments: 0,
      voteStatus: 0,
    };

    try {
      //store the post in db
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);

      //check for selectedFile
      if (selectedFile) {
        //store in storage => get download url
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadUrl = await getDownloadURL(imageRef);

        //update post doc by adding imageUrl
        await updateDoc(postDocRef, {
          imageUrl: downloadUrl,
        });
      }

      setSuccess("Congrats Your Post has been successfully created");
      //redirect the user back to community page
      router.back();
    } catch (err: any) {
      setError(err.message);
      console.log("NewPostForm error", err);
    }

    setLoading(false);
  };

  const onTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Flex direction="column" bg="white" borderRadius="4" mt="2">
      <Flex width="100%">
        {formTabs.map((item) => (
          <>
            <TabItem
              item={item}
              selectedTab={item.title === selectedTab}
              setSelectedTab={setSelectedTab}
              fileSelected={!!selectedFile}
            />
          </>
        ))}
      </Flex>
      <Flex padding={"16px"}>
        {selectedTab === "Post" && (
          <TextInputs
            handleCreatePost={handleCreatePost}
            onChange={onTextChange}
            loading={loading}
            textInputs={textInputs}
            error={error}
            success={success}
          />
        )}
        {selectedTab === "Images & Video" && (
          <ImageUpload
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            setSelectedTab={setSelectedTab}
            onSelectImage={onSelectFile}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default NewPostForm;
