import Loader from "@/components/loader";
import { UserState } from "@/redux/userSlice";
import { usePathname } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

function Content({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute =
    pathname.includes("sign-in") || pathname.includes("sign-up");

  if (isPublicRoute) return children;

  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );

  if (!currentUserData) return <Loader />;

  return <div>{children}</div>;
}

export default Content;
