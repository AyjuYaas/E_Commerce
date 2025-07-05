"use client";

import { useCartStore } from "@/app/store/useCartStore";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import esewa from "@/images/esewa.png";
// import khalti from "@/images/khalti.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";
import useAuthStore from "@/app/store/useAuthStore";
import axios from "axios";

interface FormData {
  location: string;
  phone: string;
}

const CheckoutLayout = () => {
  const { cartItems, getCartItems, resetCartData, loadingCartItems } =
    useCartStore();

  const [subTotal, setSubTotal] = useState<number>(0);
  useEffect(() => {
    const subtotal = cartItems.reduce((total, item) => {
      return total + item.quantity * item.product.price;
    }, 0);

    setSubTotal(subtotal + subtotal * (8 / 100));
  }, [cartItems]);

  useEffect(() => {
    getCartItems();

    return () => {
      resetCartData();
    };
  }, [getCartItems, resetCartData]);

  const [formData, setFormData] = useState<FormData>({
    location: "",
    phone: "",
  });

  const { user } = useAuthStore();

  const checkoutHandle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location || !formData.phone) {
      toast.error("Please fill in your location and phone");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to proceed");
      return;
    }

    try {
      toast.loading("Redirecting to esewa");

      localStorage.setItem("checkout_location", formData.location);
      localStorage.setItem("checkout_phone", formData.phone);

      const res = await axios.post("/api/payment/initiate", {
        amount: subTotal,
        name: user?.name,
        email: user?.email,
      });

      const { paymentUrl, params } = res.data;

      const form = document.createElement("form");
      form.method = "POST";
      form.action = paymentUrl;
      form.style.display = "none";

      const addField = (name: string, value: string) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      };

      addField("amount", params.amount);
      addField("tax_amount", params.tax_amount);
      addField("total_amount", params.total_amount);
      addField("transaction_uuid", params.transaction_uuid);
      addField("product_code", params.product_code);
      addField("product_service_charge", params.product_service_charge);
      addField("product_delivery_charge", params.product_delivery_charge);
      addField("signed_field_names", params.signed_field_names);
      addField("signature", params.signature);
      addField("success_url", params.success_url);
      addField("failure_url", params.failure_url);

      document.body.appendChild(form);
      form.submit();

      toast.dismiss(); // Remove loading toast
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.dismiss();
      toast.error(
        error?.response?.data?.message ||
          "Failed to initiate payment. Please try again."
      );
    }
  };

  if (loadingCartItems) {
    return (
      <div className="flex items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col gap-5 border-2 p-5 rounded-sm max-w-[30rem]">
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

              <form onSubmit={checkoutHandle} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="location">Location</label>
                  <Input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
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
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    className="w-[20rem]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <h1>Choose a Payment Method</h1>

                  <Button
                    variant={"ghost"}
                    className="h-20 w-max"
                    type="button"
                  >
                    <Image src={esewa} alt="esewa" width={50} height={50} />
                  </Button>
                </div>

                <div>
                  <hr className="my-2" />
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
