"use client";

import { checkAuth } from "@/actions/auth.action";
import { useCartStore } from "../../store/useCartStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import IndividualCartItem from "./IndividualCartItem";
import useAuthStore from "@/app/store/useAuthStore";
import PriceCalculation from "./PriceCalculation";
import { ShoppingBasket } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const ViewCart = () => {
  const router = useRouter();

  const { cartItems, getCartItems, resetCartData, loadingCartItems } =
    useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    (async () => {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated.success) {
        router.push("/auth/login");
      }
    })();
  }, [router, user]);

  useEffect(() => {
    getCartItems();
    return () => {
      resetCartData();
    };
  }, [getCartItems, resetCartData]);

  if (loadingCartItems) {
    return (
      <div className="flex items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      {cartItems.length === 0 ? (
        <div className="bg-gray-600/50 backdrop-blur-3xl p-5 flex items-center gap-4 rounded-md">
          <ShoppingBasket size={40} />
          <span className="text-2xl">Your Cart is Empty</span>
        </div>
      ) : (
        <div className="w-[20rem] md:w-[40rem] flex flex-col gap-5">
          <h1 className="text-2xl font-bold">Your Cart Items</h1>
          <section className="flex flex-col items-start md:items-stretch gap-7">
            {cartItems.map((cartItem) => (
              <IndividualCartItem key={cartItem.id} cartItem={cartItem} />
            ))}
          </section>

          <hr />

          <PriceCalculation cartItems={cartItems} />
        </div>
      )}
    </div>
  );
};

export default ViewCart;
