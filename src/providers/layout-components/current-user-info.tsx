import { UserType } from "@/interfaces";
import { useClerk } from "@clerk/nextjs";
import { Button, Divider, Drawer, Upload, message } from "antd";
import dayjs from "dayjs";
import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { SetCurrentUser, UserState } from "@/redux/userSlice";
import { UploadImageToFirebaseAndReturnUrl } from "@/helpers/image-upload";
import { UpdateUserProfile } from "@/server-actions/users";
import socket from "@/config/socket-config";

function CurrentUserInfo({
  showCurrentUserInfo,
  setShowCurrentUserInfo,
}: {
  showCurrentUserInfo: boolean;
  setShowCurrentUserInfo: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const { signOut } = useClerk();
  const router = useRouter();
  const dispatch = useDispatch();

  const getProperty = (key: string, value: string) => {
    return (
      <div className="flex flex-col ">
        <span className="font-semibold text-gray-700">{key}</span>
        <span className="text-gray-600">{value}</span>
      </div>
    );
  };

  const onLogout = async () => {
    try {
      setLoading(true);
      socket.emit("logout", currentUserData?._id!);
      await signOut();
      setShowCurrentUserInfo(false);
      message.success("Logged out successfully");
      router.push("/sign-in");
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onProfilePictureUpdate = async () => {
    try {
      setLoading(true);
      const url: string = await UploadImageToFirebaseAndReturnUrl(
        selectedFile!
      );
      const response = await UpdateUserProfile(currentUserData?._id!, {
        profilePicture: url,
      });
      if (response.error) throw new Error(response.error);
      dispatch(SetCurrentUser(response));
      message.success("Profile picture updated successfully");
      setShowCurrentUserInfo(false);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
      setSelectedFile(null);
    }
  };

  return (
    <Drawer
      open={showCurrentUserInfo}
      onClose={() => setShowCurrentUserInfo(false)}
      title="Profile"
    >
      {currentUserData && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-5 justify-center items-center">
            {!selectedFile && (
              <img
                src={currentUserData?.profilePicture}
                alt="profile"
                className="w-28 h-28 rounded-full"
              />
            )}
            <Upload
              beforeUpload={(file) => {
                setSelectedFile(file);
                return false;
              }}
              className="cursor-pointer"
              listType={selectedFile ? "picture-circle" : "text"}
              maxCount={1}
            >
              Change Profile Picture
            </Upload>
          </div>

          <Divider className="my-1 border-gray-200" />

          <div className="flex flex-col gap-5">
            {getProperty("Name", currentUserData.name)}
            {getProperty("Username", currentUserData.userName)}
            {getProperty("Id", currentUserData._id)}
            {getProperty(
              "Joined On",
              dayjs(currentUserData.createdAt).format("DD MMM YYYY hh:mm A")
            )}
          </div>

          <div className="mt-5 flex flex-col gap-5">
            <Button
              className="w-full"
              block
              loading={loading}
              onClick={onProfilePictureUpdate}
              disabled={!selectedFile}
            >
              Update Profile Picture
            </Button>
            <Button
              className="w-full"
              block
              loading={loading && !selectedFile}
              onClick={onLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  );
}

export default CurrentUserInfo;
