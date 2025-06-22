import useAuthStore from "@/app/store/useAuthStore";
import { Button } from "@/components/ui/button";

import { LogOutIcon, User2 } from "lucide-react";
import Link from "next/link";

const LoginButton = () => {
  const { user, logout } = useAuthStore();

  return (
    <>
      {user ? (
        <>
          <div className="self-center hidden lg:block">
            <Button variant={"ghost"}>
              <User2 className="w-6 h-6" /> {user.name?.split(" ")[0]}
            </Button>

            <Button variant={"ghost"} onClick={logout}>
              <LogOutIcon className="w-6 h-6" />
            </Button>
          </div>

          <div className="self-center flex flex-col gap-5 lg:hidden">
            <Button variant={"default"}>
              <User2 className="w-6 h-6" /> {user.name?.split(" ")[0]}&#39;s
              Profile
            </Button>

            <Button variant={"destructive"} onClick={logout}>
              <LogOutIcon className="w-6 h-6" /> Logout
            </Button>
          </div>
        </>
      ) : (
        <div>
          <Button
            variant={"default"}
            className="text-lg w-full"
            size={"lg"}
            asChild
          >
            <Link href={"/auth/login"}>Login</Link>
          </Button>
        </div>
      )}
    </>
  );
};
export default LoginButton;
