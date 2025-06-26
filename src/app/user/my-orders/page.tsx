import { Metadata } from "next";
import OrderLayout from "./OrderLayout";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Orders",
  };
}

const CartPage = () => {
  return <OrderLayout />;
};

export default CartPage;
