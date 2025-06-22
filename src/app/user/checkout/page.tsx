import { Metadata } from "next";
import CheckoutLayout from "./CheckoutLayout";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Checkout",
  };
}

const CartPage = () => {
  return <CheckoutLayout />;
};

export default CartPage;
