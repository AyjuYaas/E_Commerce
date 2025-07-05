"use client";

import { Button } from "@/components/ui/button";
import { Home, StepBack } from "lucide-react";
import { useRouter } from "next/navigation";

const PaymentFailure = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify center gap-5">
      <h1 className="font-bold text-xl">
        Sorry, Your Esewa payment has failed
      </h1>
      <div className="flex gap-4 text-lg">
        <Button
          variant={"secondary"}
          className="flex items-center"
          onClick={() => router.push("/")}
        >
          <Home />
          Go to home
        </Button>
        <Button
          variant={"secondary"}
          className="flex items-center"
          onClick={() => router.push("/user/checkout")}
        >
          <StepBack />
          Go to checkout
        </Button>
      </div>
    </div>
  );
};
export default PaymentFailure;
