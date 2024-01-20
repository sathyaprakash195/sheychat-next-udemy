import { MessageType } from "@/interfaces";
import { ChatState, SetChats } from "@/redux/chatSlice";
import { GetChatMessages, ReadAllMessages } from "@/server-actions/messages";
import { message } from "antd";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Message from "./message";
import { UserState } from "@/redux/userSlice";
import socket from "@/config/socket-config";

function Messages() {
  const [messages, setMessages] = React.useState<MessageType[]>([]);
  const [loading, setLoading] = React.useState(false);
  const { selectedChat, chats }: ChatState = useSelector(
    (state: any) => state.chat
  );
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );
  const dispatch = useDispatch();

  const messagesDivRef = React.useRef<HTMLDivElement>(null);

  const getMessages = async () => {
    try {
      setLoading(true);
      const response = await GetChatMessages(selectedChat?._id!);
      if (response.error) throw new Error(response.error);
      setMessages(response);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getMessages();
  }, [selectedChat]);

  useEffect(() => {
    // listen for new messages
    socket.on("new-message-received", (message: MessageType) => {
      if (selectedChat?._id === message.chat._id) {
        setMessages((prev) => {
          const isMessageAlreadyExists = prev.find(
            (msg) => msg.socketMessageId === message.socketMessageId
          );
          if (isMessageAlreadyExists) return prev;
          else return [...prev, message];
        });
      }
    });

    // listen for user-read-all-chat-messages event
    socket.on(
      "user-read-all-chat-messages",
      ({ chatId, readByUserId }: { chatId: string; readByUserId: string }) => {
        if (selectedChat?._id === chatId) {
          setMessages((prev) => {
            const newMessages = prev.map((msg) => {
              if (
                msg.sender._id !== readByUserId &&
                !msg.readBy.includes(readByUserId)
              ) {
                return { ...msg, readBy: [...msg.readBy, readByUserId] };
              }
              return msg;
            });

            return newMessages;
          });
        }
      }
    );
  }, [selectedChat]);

  useEffect(() => {
    // scroll to top when new message arrives
    if (messagesDivRef.current) {
      messagesDivRef.current.scrollTop =
        messagesDivRef.current.scrollHeight + 100;
    }

    // clear unread messages

    let unreadMessages = 0;
    let chat = chats.find((chat) => chat._id === selectedChat?._id);
    if (chat) {
      unreadMessages = chat.unreadCounts[currentUserData?._id!] || 0;
    }

    if (unreadMessages > 0) {
      ReadAllMessages({
        userId: currentUserData?._id!,
        chatId: selectedChat?._id!,
      });

      socket.emit("read-all-messages", {
        chatId: selectedChat?._id!,
        readByUserId: currentUserData?._id!,
        users: selectedChat?.users
          .filter((user) => user._id !== currentUserData?._id!)
          .map((user) => user._id),
      });
    }

    // set the unread messages to 0 for the selected chat
    const newChats = chats.map((chat) => {
      if (chat._id === selectedChat?._id) {
        let chatData = { ...chat };
        chatData.unreadCounts = { ...chat.unreadCounts };
        chatData.unreadCounts[currentUserData?._id!] = 0;
        return chatData;
      } else return chat;
    });

    dispatch(SetChats(newChats));
  }, [messages]);

  return (
    <div className="flex-1 p-3 overflow-y-scroll" ref={messagesDivRef}>
      <div className="flex flex-col gap-3">
        {messages.map((message) => {
          return <Message key={message._id} message={message} />;
        })}
      </div>
    </div>
  );
}

export default Messages;
