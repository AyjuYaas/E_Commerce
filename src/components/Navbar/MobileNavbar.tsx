import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import LoginButton from "./LoginButton";

const MobileNavbar = () => {
  return (
    <section className="flex md:hidden ">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <Menu />
          </Button>
        </SheetTrigger>

        <SheetContent className="z-[110] fixed">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>

          <section className="block lg:hidden gap-2 w-full mt-6">
            <LoginButton />
          </section>
        </SheetContent>
      </Sheet>
    </section>
  );
};
export default MobileNavbar;
