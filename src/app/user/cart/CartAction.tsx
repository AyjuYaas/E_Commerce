import { Button } from "@/components/ui/button";
import { CartItem } from "@/types/cart.types";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";

const CartAction = ({ cartItem }: { cartItem: CartItem }) => {
  const { deleteCartItem, loadingDelete, updateCartItemQuantity } =
    useCartStore();
  return (
    <section className="flex flex-col gap-3">
      <article className="flex gap-5">
        {cartItem.product.quantity !== 0 && (
          <article className="flex items-center">
            <Button
              variant={"outline"}
              className="rounded-full border-2"
              disabled={
                cartItem.quantity === 1 || cartItem.product.quantity === 0
              }
              onClick={() =>
                updateCartItemQuantity(
                  cartItem.productId,
                  cartItem.quantity - 1
                )
              }
            >
              <Minus />
            </Button>
            <span className="mx-4 text-lg">{cartItem.quantity}</span>
            <Button
              variant={"outline"}
              className="rounded-full border-2"
              disabled={
                cartItem.quantity === cartItem.product.quantity ||
                cartItem.product.quantity === 0
              }
              onClick={() =>
                updateCartItemQuantity(
                  cartItem.productId,
                  cartItem.quantity + 1
                )
              }
            >
              <Plus />
            </Button>
          </article>
        )}

        <Button
          className="bg-red-800 text-white hover:bg-red-700 size-8 rounded-md flex items-center justify-center"
          onClick={() => deleteCartItem(cartItem.id)}
          disabled={loadingDelete}
        >
          <Trash2 size={20} />
        </Button>
      </article>

      <article className="text-sm text-end text-gray-400 font-bold">
        Total: Rs. {cartItem.quantity * cartItem.product.price}
      </article>
    </section>
  );
};
export default CartAction;
