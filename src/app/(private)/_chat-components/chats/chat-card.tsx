import { formatDateTime } from "@/helpers/date-formats";
import { ChatType } from "@/interfaces";
import { ChatState, SetSelectedChat } from "@/redux/chatSlice";
import { UserState } from "@/redux/userSlice";
import React from "react";
import { useSelector, useDispatch } from "react-redux";

function ChatCard({ chat }: { chat: ChatType }) {
  const dispatch = useDispatch();
  const { currentUserData, onlineUsers }: UserState = useSelector(
    (state: any) => state.user
  );
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);
  let chatName = "";
  let chatImage = "";

  // todo: get last message
  let lastMessage = "";
  let lastMessageSenderName = "";
  let lastMessageTime = "";

  if (chat.isGroupChat) {
    chatName = chat.groupName;
    chatImage = chat.groupProfilePicture;
  } else {
    const receipient = chat.users.find(
      (user) => user._id !== currentUserData?._id
    );
    chatName = receipient?.name!;
    chatImage = receipient?.profilePicture!;
  }

  if (chat?.lastMessage) {
    lastMessage = chat?.lastMessage?.text;
    lastMessageSenderName =
      chat?.lastMessage?.sender._id === currentUserData?._id
        ? "You :"
        : `${chat?.lastMessage?.sender.name.split(" ")[0]} :`;
    lastMessageTime = formatDateTime(chat.lastMessage.createdAt);
  }

  const isSelected = selectedChat?._id === chat._id;

  const unreadCounts = () => {
    if (
      !chat?.unreadCounts ||
      !chat?.unreadCounts[currentUserData?._id!] ||
      chat._id === selectedChat?._id
    ) {
      return null;
    }

    return (
      <div className="bg-green-700 h-5 w-5 rounded-full flex justify-center items-center">
        <span className="text-white text-xs">
          {chat.unreadCounts[currentUserData?._id!]}
        </span>
      </div>
    );
  };

  const onlineIndicator = () => {
    if (chat.isGroupChat) return null;
    const recipientId = chat.users.find(
      (user) => user._id !== currentUserData?._id
    )?._id;
    if (onlineUsers.includes(recipientId!)) {
      return <div className="w-2 h-2 rounded-full bg-green-700"></div>;
    }
  };

  return (
    <div
      className={`flex justify-between hover:bg-gray-100 py-3 px-2 rounded cursor-pointer
       ${isSelected ? "bg-gray-100 border border-gray-300 border-solid" : ""}
      `}
      onClick={() => dispatch(SetSelectedChat(chat))}
    >
      <div className="flex gap-5 items-center">
        <img src={chatImage} alt="" className="w-10 h-10 rounded-full" />
        <div className="flex flex-col gap-1">
          <span className="text-gray-700 text-sm flex gap-2 items-center">
            {chatName}
            {onlineIndicator()}
          </span>
          <span className="text-gray-500 text-xs">
            {" "}
            {lastMessageSenderName} {lastMessage}
          </span>
        </div>
      </div>

      <div>
        {unreadCounts()}
        <span className="text-xs text-gray-500">{lastMessageTime}</span>
      </div>
    </div>
  );
}

export default ChatCard;
