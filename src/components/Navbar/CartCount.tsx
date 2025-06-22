"use client";

import useAuthStore from "@/app/store/useAuthStore";
import { useCartStore } from "@/app/store/useCartStore";
import { useEffect } from "react";

const CartCount = () => {
  const { cartCount, getCartCount } = useCartStore();
  const { user } = useAuthStore();
  useEffect(() => {
    getCartCount();
  }, [getCartCount, user]);

  return (
    <div className="bg-gray-600 absolute -top-1 right-0 size-5 flex items-center justify-center rounded-full text-white">
      {cartCount}
    </div>
  );
};

export default CartCount;
