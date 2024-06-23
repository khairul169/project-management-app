import { useDbContext } from "@/context/database";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createStore, useStore } from "zustand";
import { persist } from "zustand/middleware";

type AuthStoreType = {
  token: string | null;
};

export const authStore = createStore(
  persist<AuthStoreType>(
    () => ({
      token: null,
    }),
    {
      name: "auth",
    }
  )
);

export const useAuth = () => {
  const data = useStore(authStore);
  return { ...data, isLoggedIn: !!data.token };
};

export const useLogin = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  return (token: string) => {
    authStore.setState({ token });
    const prevPage = params.get("prev") || "/";
    navigate(prevPage);
  };
};

export const useLogout = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const db = useDbContext();

  return async () => {
    if (!auth.token) {
      return;
    }

    authStore.setState({ token: null });
    await db.clearAll();
    navigate("/auth/login");
  };
};
