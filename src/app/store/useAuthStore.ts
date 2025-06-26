/* eslint-disable @typescript-eslint/no-explicit-any */
import { checkAuth, loginUser, logoutUser } from "@/actions/auth.action";
import toast from "react-hot-toast";
import { create } from "zustand";

interface User {
  id?: string;
  name?: string;
  email?: string;
}

interface UserStore {
  user: User | null;
  loadingUserCheck: boolean;

  userLogin: (user: { email: string; password: string }) => Promise<boolean>;

  userCheck: () => void;

  logout: () => void;
}

const useAuthStore = create<UserStore>((set) => ({
  user: null,
  loadingUserCheck: true,

  userLogin: async (user) => {
    try {
      const res = await loginUser(user);
      if (res.success) {
        toast.success("Login Successful");
        set({ user: res.user });
        return true;
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.error || "Unexpected error occurred");
    }
    return false;
  },

  userCheck: async () => {
    try {
      set({ loadingUserCheck: true });
      const res = await checkAuth();
      set({ user: res.user });
    } catch (error) {
      console.log(error);
      set({ user: null });
    } finally {
      set({ loadingUserCheck: false });
    }
  },

  logout: async () => {
    await logoutUser();
    set({ user: null });
    toast.success("Logout Successful");
  },
}));

export default useAuthStore;
