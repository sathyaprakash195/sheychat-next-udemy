import { formatDateTime } from "@/helpers/date-formats";
import { ChatState } from "@/redux/chatSlice";
import { UserState } from "@/redux/userSlice";
import { Button, Divider, Drawer } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

function RecipientInfo({
  showRecipientInfo,
  setShowRecipientInfo,
}: {
  showRecipientInfo: boolean;
  setShowRecipientInfo: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);

  let chatName = "";
  let chatImage = "";
  if (selectedChat?.isGroupChat) {
    chatName = selectedChat.groupName;
    chatImage = selectedChat.groupProfilePicture;
  } else {
    const receipient = selectedChat?.users.find(
      (user) => user._id !== selectedChat?._id
    );
    chatName = receipient?.name!;
    chatImage = receipient?.profilePicture!;
  }

  const getProperty = (key: string, value: string) => {
    return (
      <div className="flex flex-col ">
        <span className="font-semibold text-gray-700">{key}</span>
        <span className="text-gray-600">{value}</span>
      </div>
    );
  };

  return (
    <Drawer
      open={showRecipientInfo}
      onClose={() => setShowRecipientInfo(false)}
      title={chatName}
    >
      <div className="flex justify-center flex-col items-center gap-5">
        <img src={chatImage} alt="" className="w-28 h-28 rounded-full" />
        <span className="text-gray-700">{chatName}</span>
      </div>

      <Divider className="my-3 border-gray-200" />

      {selectedChat?.isGroupChat && (
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">
              {selectedChat.users.length} Members
            </span>
            <Button
              size="small"
              onClick={() =>
                router.push(`/groups/edit-group/${selectedChat._id}`)
              }
            >
              Edit Group
            </Button>
          </div>
          {selectedChat.users.map((user) => (
            <div className="flex gap-5 items-center" key={user._id}>
              <img
                src={user.profilePicture}
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <span className="text-gray-700 text-sm">{user.name}</span>
            </div>
          ))}
        </div>
      )}

      <Divider className="my-3 border-gray-200" />

      <div className="flex flex-col gap-5">
        {getProperty("Created On", formatDateTime(selectedChat?.createdAt!))}
        {getProperty("Created By", selectedChat?.createdBy?.name!)}
      </div>
    </Drawer>
  );
}

export default RecipientInfo;
