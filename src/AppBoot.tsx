import { useEffect } from "react";
import { useAuthMeQuery } from "./services/generated/api";
import { useAppDispatch } from "./app/hooks";
import { logout } from "./state/authSlice";

export default function AppBoot({ children }: { children: React.ReactNode }) {
  const hasToken = !!localStorage.getItem("accessToken");
  const { isError, isFetching } = useAuthMeQuery(undefined, {
    skip: !hasToken,
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!hasToken) dispatch(logout());
  }, [hasToken, dispatch]);
  if (hasToken && isFetching) return null;
  if (isError) return null;
  return <>{children}</>;
}
