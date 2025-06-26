"use client";

import Link from "next/link";
import ThemeToggleButton from "../ThemeToggleButton";
import LoginButton from "./LoginButton";
import MobileNavbar from "./MobileNavbar";
import CartCount from "./CartCount";
import { ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";
import useAuthStore from "@/app/store/useAuthStore";
import { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

const Navbar = () => {
  const { userCheck, loadingUserCheck } = useAuthStore();

  useEffect(() => {
    userCheck();
  }, [userCheck]);
  return (
    <nav className="sticky w-full top-0 flex justify-between items-center h-16 px-5 md:px-10 border-b z-[99] bg-background">
      <Link href={"/"} className="text-2xl font-bold">
        Pinguina&apos;s Mart
      </Link>

      <div className="flex items-center gap-2">
        <ThemeToggleButton />

        {loadingUserCheck ? (
          <div className="flex gap-2">
            <Button variant={"ghost"} disabled>
              <Skeleton className="h-8 w-8" />
            </Button>

            <Button variant={"ghost"} disabled>
              <Skeleton className="h-8 w-8" />
            </Button>
          </div>
        ) : (
          <>
            <Link href={"/user/cart"}>
              <Button variant={"ghost"} className="relative">
                <CartCount />
                <ShoppingBag size={20} />
              </Button>
            </Link>

            {/* Desktop Navbar */}
            <section className="hidden md:flex gap-2">
              <LoginButton />
            </section>

            <MobileNavbar />
          </>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
