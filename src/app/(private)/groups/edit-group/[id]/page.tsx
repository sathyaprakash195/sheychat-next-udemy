import { UserType } from "@/interfaces";
import ChatModel from "@/models/chat-model";
import UserModel from "@/models/user-model";
import Link from "next/link";
import React from "react";
import GroupForm from "../../_components/group-form";

async function EditGroup({ params }: { params: any }) {
  const id = params.id;
  const users: UserType[] = await UserModel.find({});
  const chat = await ChatModel.findById(id);
  return (
    <div className="p-5">
      <Link
        className="text-primary border border-primary px-5 py-2 no-underline border-solid text-sm"
        href="/"
      >
        Back To Chats
      </Link>
      <h1 className="text-primary text-xl font-bold py-2 uppercase">
        Create Group Chat
      </h1>

      <GroupForm
        initialData={JSON.parse(JSON.stringify(chat))}
        users={JSON.parse(JSON.stringify(users))}
      />
    </div>
  );
}

export default EditGroup;
