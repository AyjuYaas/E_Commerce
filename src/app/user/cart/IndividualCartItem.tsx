import { CartItem } from "@/types/cart.types";
import CartAction from "./CartAction";
import Link from "next/link";

const IndividualCartItem = ({ cartItem }: { cartItem: CartItem }) => {
  return (
    <div
      key={cartItem.id}
      className="flex flex-col md:flex-row gap-4 items-center justify-between"
    >
      <Link
        href={`/product/${cartItem.productId}`}
        className="flex gap-5 items-center hover:cursor-pointer"
      >
        <img
          src={cartItem.product.image}
          alt={cartItem.product.name}
          className="size-20"
        />

        <article>
          <h1>{cartItem.product.name}</h1>
          <p className="text-green-500">Rs. {cartItem.product.price}</p>

          {cartItem.product.quantity <= 5 && (
            <p className="text-sm text-orange-500">
              Only {cartItem.product.quantity} item/s in stock!
            </p>
          )}

          {cartItem.product.quantity === 0 && (
            <p className="text-red-700">Out of Stock!!</p>
          )}
        </article>
      </Link>

      <CartAction cartItem={cartItem} />
    </div>
  );
};
export default IndividualCartItem;
