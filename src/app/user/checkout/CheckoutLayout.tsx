"use client";

import { useCartStore } from "@/app/store/useCartStore";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import esewa from "@/images/esewa.png";
import khalti from "@/images/khalti.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const CheckoutLayout = () => {
  const { cartItems, getCartItems, resetCartData } = useCartStore();

  const [subTotal, setSubTotal] = useState<number>(0);
  useEffect(() => {
    const subtotal = cartItems.reduce((total, item) => {
      return total + item.quantity * item.product.price;
    }, 0);

    setSubTotal(subtotal + 100 + subtotal * (8 / 100));
  }, [cartItems]);

  useEffect(() => {
    getCartItems();

    return () => {
      resetCartData();
    };
  }, [getCartItems, resetCartData]);

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col gap-5 border-2 p-5 rounded-sm">
        <section className="flex flex-col text-2xl font-bold">
          <span>Proceed to</span>
          <span className="font-light">Checkout</span>
        </section>

        {cartItems.length === 0 ? (
          <section>
            <h1 className="text-xl">Sorry, No Items in Cart Currently</h1>
          </section>
        ) : (
          <>
            <section>
              <h1 className="text-xl">Your Orders: </h1>
              <article>
                {cartItems.map((item) => (
                  <div key={item.id}>
                    <span className="text-orange-600 font-bold">
                      {item.product.name}
                    </span>{" "}
                    * {item.quantity}
                  </div>
                ))}
              </article>
            </section>
            <section>
              <h1 className="text-xl font-bold mb-2">Enter your details</h1>

              <form action="" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="location">Location</label>
                  <Input
                    type="text"
                    name="location"
                    placeholder="Enter your location"
                    className="w-[20rem]"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="phone">Contact Number</label>
                  <Input
                    type="text"
                    name="phone"
                    placeholder="Enter your phone number"
                    minLength={10}
                    maxLength={10}
                    required
                    className="w-[20rem]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <h1>Choose a Payment Method</h1>
                  <section className="flex gap-5">
                    <Button variant={"ghost"} className="h-20" type="button">
                      <Image src={esewa} alt="esewa" width={50} height={50} />
                    </Button>

                    <Button variant={"ghost"} className="h-20" type="button">
                      <Image src={khalti} alt="khalti" width={50} height={50} />
                    </Button>
                  </section>
                </div>

                <div>
                  <hr />
                  <div className="flex justify-between font-bold">
                    <span>Total Amount</span>
                    <span>Rs. {subTotal}</span>
                  </div>
                </div>

                <div>
                  <Button className="w-full">Place Your Order</Button>
                </div>
              </form>
            </section>
          </>
        )}
      </div>
    </div>
  );
};
export default CheckoutLayout;
