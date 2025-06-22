import { Button } from "@/components/ui/button";
import { CartItem } from "@/types/cart.types";
import Link from "next/link";
import { useEffect, useState } from "react";

const PriceCalculation = ({ cartItems }: { cartItems: CartItem[] }) => {
  const [subTotal, setSubTotal] = useState<number>(0);

  useEffect(() => {
    const subtotal = cartItems.reduce((total, item) => {
      return total + item.quantity * item.product.price;
    }, 0);
    setSubTotal(subtotal);
  }, [cartItems]);

  return (
    <section className="flex flex-col gap-4">
      <article className="flex justify-between">
        <span>Sub Total</span>
        <span>Rs. {subTotal}</span>
      </article>

      <article className="flex justify-between">
        <span>Tax (8%)</span>
        <span>Rs. {(subTotal * 8) / 100}</span>
      </article>

      <article className="flex justify-between">
        <span>Delivery Charge</span>
        <span>Rs. 100</span>
      </article>

      <article className="flex justify-between font-bold text-orange-600">
        <span>Grand Total</span>
        <span>Rs. {subTotal + 100 + (subTotal * 8) / 100}</span>
      </article>

      <Link href="/user/checkout">
        <Button className="w-full">Proceed to Checkout</Button>
      </Link>
    </section>
  );
};
export default PriceCalculation;
