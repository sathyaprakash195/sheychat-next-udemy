import { MessageType } from "@/interfaces";
import React from "react";
import { useSelector } from "react-redux";
import { UserState } from "@/redux/userSlice";
import { ChatState } from "@/redux/chatSlice";

import { formatDateTime } from "@/helpers/date-formats";

function Message({ message }: { message: MessageType }) {
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);

  const isLoggedInUserMessage = message.sender._id === currentUserData?._id;

  let read = false;
  if (
    selectedChat &&
    selectedChat?.users?.length - 1 === message.readBy.length
  ) {
    read = true;
  }

  if (isLoggedInUserMessage) {
    return (
      <div className="flex justify-end gap-2">
        <div className="flex flex-col gap-2">
          {message.text && (
            <p className="bg-primary text-white py-2 px-7 rounded-xl rounded-tl-none m-0 text-sm">
              {message.text}
            </p>
          )}
          {message.image && (
            <img
              src={message.image}
              alt="message"
              className="w-40 h-40 rounded-xl rounded-tl-none"
            />
          )}
          <div className="flex justify-between">
            <span className="text-gray-500 text-xs">
              {formatDateTime(message.createdAt)}
            </span>
            <i
              className={`ri-check-double-line ${
                read ? "text-blue-500" : "text-gray-400"
              }`}
            ></i>
          </div>
        </div>
        <img
          src={message.sender.profilePicture}
          alt="avatar"
          className="w-6 h-6 rounded-full"
        />
      </div>
    );
  } else {
    return (
      <div className="flex gap-2">
        <img
          src={message.sender.profilePicture}
          alt="avatar"
          className="w-6 h-6 rounded-full"
        />
        <div className="flex flex-col gap-2">
          <div className="bg-gray-200 py-2 px-7 rounded-xl rounded-tr-none">
            <span className="text-blue-500 text-xs font-semibold">
              {message.sender.name}
            </span>
            {message.text && <p className="m-0 mt-1 text-sm">{message.text}</p>}
          </div>
          {message.image && (
            <img
              src={message.image}
              alt="message"
              className="w-40 h-40 rounded-xl rounded-tr-none"
            />
          )}
          <span className="text-gray-500 text-xs">
            {formatDateTime(message.createdAt)}
          </span>
        </div>
      </div>
    );
  }
}

export default Message;
