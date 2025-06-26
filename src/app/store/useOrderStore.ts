import { getUserReview, postReview, viewOrder } from "@/actions/user.action";
import { UserOrderTypes } from "@/types/order.types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface OrderStore {
  orders: UserOrderTypes[];
  loadingOrders: boolean;

  review: {
    id: string;
    rating: number;
    comment: string;
  } | null;
  loadingReview: boolean;

  loadingPostReview: boolean;

  fetchOrders: () => void;
  fetchReview: (productId: string) => void;
  resetReview: () => void;

  submitReview: (
    rating: number,
    review: string,
    productId: string
  ) => Promise<boolean>;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  loadingOrders: true,
  review: null,
  loadingReview: true,
  loadingPostReview: false,

  fetchOrders: async () => {
    set({ loadingOrders: true });
    const res = await viewOrder();

    if (res.success) {
      set({ orders: res.orders });
    } else {
      toast.error("Couldn't fetch Order, please reload the page");
    }

    set({ loadingOrders: false });
  },

  fetchReview: async (productId) => {
    set({ loadingReview: true });
    const res = await getUserReview(productId);

    if (res.success) {
      set({ review: res.review });
    } else {
      set({ review: null });
    }

    set({ loadingReview: false });
  },

  resetReview: async () => {
    set({ review: null });
  },

  submitReview: async (rating, review, productId) => {
    set({ loadingPostReview: true });
    const res = await postReview({ rating, review, productId });

    if (res.success) {
      toast.success(res.message || "Successfully posted your review");
      set({ loadingPostReview: false });
      return true;
    } else {
      toast.error(res.error || "Something went wrong");
      set({ loadingPostReview: false });
      return false;
    }
  },
}));
