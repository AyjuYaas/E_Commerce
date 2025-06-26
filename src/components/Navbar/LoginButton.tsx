import useAuthStore from "@/app/store/useAuthStore";
import { Button } from "@/components/ui/button";

import { BaggageClaim, LogOutIcon, User2, UserCog } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LoginButton = () => {
  const { user, logout } = useAuthStore();

  return (
    <>
      {user ? (
        <>
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"}>
                  <User2 className="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-48 z-[100]" align="end">
                <DropdownMenuLabel>
                  {user.name?.split(" ")[0]}&apos;s Account
                </DropdownMenuLabel>

                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <UserCog /> Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href={"/user/my-orders"}>
                      <BaggageClaim /> My Orders
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup className="mb-1">
                  <DropdownMenuItem onClick={logout}>
                    <LogOutIcon /> Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="self-center flex flex-col gap-5 md:hidden">
            <Button variant={"outline"} asChild>
              <Link href={"/user/my-orders"}>
                <BaggageClaim className="w-6 h-6" />
                My Orders
              </Link>
            </Button>
            <Button variant={"default"}>
              <User2 className="w-6 h-6 border-3" /> {user.name?.split(" ")[0]}
              &#39;s Profile
            </Button>

            <Button variant={"destructive"} onClick={logout}>
              <LogOutIcon className="w-6 h-6" /> Logout
            </Button>
          </div>
        </>
      ) : (
        <div className="md:ml-4">
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
