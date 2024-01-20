"use client";

import { Divider } from "antd";
import ChatArea from "./_chat-components/chat-area";
import Chats from "./_chat-components/chats";

export default function Home() {
  return (
    <div className="flex h-[89vh]">
      <Chats />
      <Divider type="vertical" className="h-full border-gray-300 px-0 mx-0" />
      <ChatArea />
    </div>
  );
}
