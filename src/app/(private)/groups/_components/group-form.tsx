"use client";
import { UserType } from "@/interfaces";
import { UserState } from "@/redux/userSlice";
import { Button, Form, Input, Upload, message } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { UploadImageToFirebaseAndReturnUrl } from "@/helpers/image-upload";
import { CreateNewChat, UpdateChat } from "@/server-actions/chats";

function GroupForm({
  users,
  initialData = null,
}: {
  users: UserType[];
  initialData?: any;
}) {
  const router = useRouter();
  const [loading = false, setLoading] = React.useState<boolean>(false);
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );
  const [selectedUserIds = [], setSelectedUserIds] = React.useState<string[]>(
    initialData?.users.filter(
      (userId: string) => userId !== currentUserData?._id!
    ) || []
  );
  const [selectedProfilePicture, setSelectedProfilePicture] =
    React.useState<File>();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const payload = {
        groupName: values.groupName,
        groupBio: values.groupDescription,
        users: [...selectedUserIds, currentUserData?._id!],
        createdBy: currentUserData?._id!,
        isGroupChat: true,
        groupProfilePicture: initialData?.groupProfilePicture || "",
      };

      if (selectedProfilePicture) {
        payload.groupProfilePicture = await UploadImageToFirebaseAndReturnUrl(
          selectedProfilePicture
        );
      }

      let response: any = null;
      if (initialData) {
        response = await UpdateChat({
          chatId: initialData._id,
          payload: payload,
        });
      } else {
        response = await CreateNewChat(payload);
      }
      if (response.error) throw new Error(response.error);
      message.success(
        initialData
          ? "Group updated successfully"
          : "Group created successfully"
      );
      router.refresh();
      router.push("/");
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-2">
      <div className="flex flex-col gap-5">
        <span className="text-gray-500 text-xs">
          Select users to add to group
        </span>
        {users.map((user) => {
          if (user._id === currentUserData?._id) return null;
          return (
            <div key={user._id} className="flex gap-5 items-center">
              <input
                type="checkbox"
                checked={selectedUserIds.includes(user._id)}
                onChange={() => {
                  if (selectedUserIds.includes(user._id)) {
                    setSelectedUserIds(
                      selectedUserIds.filter((id) => id !== user._id)
                    );
                  } else {
                    setSelectedUserIds([...selectedUserIds, user._id]);
                  }
                }}
              />
              <img
                src={user.profilePicture}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-gray-500 text-sm">{user.name}</span>
            </div>
          );
        })}
      </div>
      <div>
        <Form layout="vertical" onFinish={onFinish} initialValues={initialData}>
          <Form.Item
            name="groupName"
            label="Group Name"
            rules={[{ required: true, message: "Please input group name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="groupDescription" label="Group Description">
            <Input.TextArea />
          </Form.Item>

          <Upload
            beforeUpload={(file) => {
              setSelectedProfilePicture(file);
              return false;
            }}
            maxCount={1}
            listType="picture-card"
          >
            <span className="p-3 text-xs">Upload Group Picture</span>
          </Upload>

          <div className="flex justify-end gap-5">
            <Button disabled={loading} onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {initialData ? "Update Group" : "Create Group"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default GroupForm;
