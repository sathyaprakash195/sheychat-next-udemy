"use client";
import { UserType } from "@/interfaces";
import { GetCurrentUserFromMongoDB } from "@/server-actions/users";
import { Avatar, message } from "antd";
import React, { useEffect } from "react";
import CurrentUserInfo from "./current-user-info";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { SetCurrentUser, SetOnlineUsers, UserState } from "@/redux/userSlice";
import socket from "@/config/socket-config";

function Header() {
  const pathname = usePathname();
  const isPublicRoute =
    pathname.includes("sign-in") || pathname.includes("sign-up");
  if (isPublicRoute) return null;
  const dispatch = useDispatch();
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );
  const [showCurrentUserInfo, setShowCurrentUserInfo] =
    React.useState<boolean>(false);

  const getCurrentUser = async () => {
    try {
      const response = await GetCurrentUserFromMongoDB();
      if (response.error) throw new Error(response.error);
      dispatch(SetCurrentUser(response as UserType));
    } catch (error: any) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserData) {
      socket.emit("join", currentUserData._id);

      socket.on("online-users-updated", (onlineUsers: string[]) => {
        dispatch(SetOnlineUsers(onlineUsers));
      });
    }
  }, [currentUserData]);

  return (
    currentUserData && (
      <div className="bg-gray-100 w-full px-3 py-1 flex justify-between items-center border-0 border-b border-solid border-gray-300">
        <div>
          <h1 className="text-2xl font-bold text-primary uppercase">
            Shey Chat
          </h1>
        </div>
        <div className="gap-5 flex items-center">
          <span className="text-sm">{currentUserData?.name}</span>
          <Avatar
            className="cursor-pointer"
            onClick={() => setShowCurrentUserInfo(true)}
            src={currentUserData?.profilePicture}
          />
        </div>

        {showCurrentUserInfo && (
          <CurrentUserInfo
            setShowCurrentUserInfo={setShowCurrentUserInfo}
            showCurrentUserInfo={showCurrentUserInfo}
          />
        )}
      </div>
    )
  );
}

export default Header;
