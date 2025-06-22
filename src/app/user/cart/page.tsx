import { Metadata } from "next";
import ViewCart from "./ViewCart";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Cart",
  };
}

const CartPage = () => {
  return <ViewCart />;
};

export default CartPage;
