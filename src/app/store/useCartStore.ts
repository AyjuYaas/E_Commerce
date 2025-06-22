import {
  addToCart,
  deleteCartItem,
  getNumberOfCartItems,
  updateCartItem,
  viewCartItems,
} from "@/actions/cart.action";
import { CartItem } from "@/types/cart.types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface CartStore {
  cartCount: number;
  loadingAddToCart: boolean;

  cartItems: CartItem[];
  loadingCartItems: boolean;

  loadingDelete: boolean;

  addToCart: (props: {
    userId: string;
    productId: string;
    quantity: number;
  }) => void;
  getCartCount: () => void;
  resetCartCount: () => void;

  getCartItems: () => void;
  resetCartData: () => void;

  deleteCartItem: (productId: string) => void;
  updateCartItemQuantity: (productId: string, newQuantity: number) => void;
}

const debounceTimers: Record<string, NodeJS.Timeout> = {};

export const useCartStore = create<CartStore>((set) => ({
  cartCount: 0,
  loadingAddToCart: false,

  cartItems: [],
  loadingCartItems: true,

  loadingDelete: false,

  addToCart: async ({ productId, quantity }) => {
    try {
      set({ loadingAddToCart: true });
      const res = await addToCart({
        productId,
        quantity,
      });

      if (res.success) {
        toast.success(res.message || "Product added to cart successfully");
        useCartStore.getState().getCartCount();
      } else {
        toast.error(res.error || "Failed to add product to cart");
      }
    } catch (error) {
      console.log("Error in add to cart: ", error);
      toast.error("Something went wrong");
    } finally {
      set({ loadingAddToCart: false });
    }
  },

  getCartCount: async () => {
    const res = await getNumberOfCartItems();

    if (res.success) {
      set({ cartCount: res.count });
    } else {
      set({ cartCount: 0 });
    }
  },

  resetCartCount: async () => {
    set({ cartCount: 0 });
  },

  getCartItems: async () => {
    try {
      const res = await viewCartItems();
      console.log(res);

      if (res.success) {
        set({ cartItems: res.cartItems });
      } else {
        console.log(res.error);
      }
    } catch (error) {
      console.log(error);
    }
  },

  resetCartData: async () => {
    set({ cartItems: [] });
  },

  deleteCartItem: async (cartId) => {
    try {
      set({ loadingDelete: true });
      const res = await deleteCartItem(cartId);

      if (res.success) {
        toast.success(
          res?.message || "Successfully removed item from the cart"
        );

        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== cartId),
        }));

        useCartStore.getState().getCartCount();
      } else {
        toast.error(res?.error || "Something went wrong");
      }
    } catch (error) {
      console.log("Error in delete Cart Items: ", error);
      toast.error("Something went wrong");
    } finally {
      set({ loadingDelete: false });
    }
  },

  updateCartItemQuantity: async (productId, updatedQuantity) => {
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: updatedQuantity }
          : item
      ),
    }));

    if (debounceTimers[productId]) {
      clearTimeout(debounceTimers[productId]);
    }

    debounceTimers[productId] = setTimeout(async () => {
      try {
        const res = await updateCartItem({
          productId,
          quantity: updatedQuantity,
        });

        if (!res.success) {
          toast.error(res.error || "Failed to sync cart");
        }
      } catch (error) {
        console.log("Error syncing cart: ", error);
        toast.error("Something went wrong");
      }
    }, 800);
  },
}));
