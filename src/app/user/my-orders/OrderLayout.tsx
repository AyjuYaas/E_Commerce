"use client";

import { useOrderStore } from "@/app/store/useOrderStore";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";
import ReviewModal from "./ReviewModal";
import { CircleSlash2 } from "lucide-react";
import Link from "next/link";

const OrderLayout = () => {
  const { fetchOrders, orders, loadingOrders } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loadingOrders) {
    return (
      <div className="flex items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div>
      <section>
        <h1 className="text-4xl flex flex-col">
          <span className="font-light">Your</span>
          <span className="font-bold tracking-wider">Orders</span>
        </h1>
      </section>

      <section className="mt-5 flex flex-col gap-5">
        {orders.length === 0 ? (
          <div className="bg-gray-600/50 backdrop-blur-3xl p-5 flex items-center gap-4 rounded-md w-max">
            <CircleSlash2 size={40} />
            <span className="text-2xl">You have no orders</span>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border-2 p-4 rounded-md">
              <section className="flex flex-col">
                <span className="text-lg font-bold">Order No. {order.id}</span>
                <span>Delivery Location: {order.location}</span>
                <span>Phone Number: {order.phone}</span>
                <span>Ordered At: {order.createdAt.toDateString()}</span>
              </section>

              <section className="flex flex-wrap mt-5 gap-2 max-w-[30rem]">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-1 border-4 p-5 rounded-lg w-max"
                  >
                    <Link
                      href={`/product/${item.product.id}`}
                      className="flex items-center gap-5"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="size-[8rem]"
                      />
                      <section className="flex flex-col">
                        <span className="font-bold tracking-widest">
                          {item.product.name}
                        </span>
                        <span className="text-green-600">
                          Price: {item.price}
                        </span>
                        <span>Ordered Quantity: {item.quantity}</span>
                        <span className="text-orange-400">
                          Status:{" "}
                          <span className="lowercase">{order.status}</span>
                        </span>
                      </section>
                    </Link>
                    <section className="mt-3">
                      {order.status === "DELIVERED" && (
                        <ReviewModal product={item.product} />
                      )}
                    </section>
                  </div>
                ))}
              </section>
            </div>
          ))
        )}
      </section>
    </div>
  );
};
export default OrderLayout;
