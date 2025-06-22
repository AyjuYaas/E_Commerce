import { create } from "zustand";
import { HomeProductType, ProductDetailsType } from "@/types/product.types";
import {
  getFilteredProduct,
  getProductDetails,
} from "@/actions/product.action";
import { ProductCategory } from "@/generated/prisma";

interface ProductStore {
  products: HomeProductType[];
  filterSearch: string;
  filterCategory: ProductCategory | string;
  filterPrice: string;
  loading: boolean;

  individualProduct: ProductDetailsType | null;
  loadingIndividualProduct: boolean;

  setFilterSearch: (val: string) => void;
  setFilterCategory: (val: string) => void;
  setFilterPrice: (val: string) => void;

  fetchProducts: () => void;
  fetchIndividualProduct: (productId: string) => void;
}

const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  filterSearch: "",
  filterCategory: "",
  filterPrice: "",
  loading: true,

  individualProduct: null,
  loadingIndividualProduct: true,

  setFilterSearch: (val) => {
    set({ filterSearch: val });
    get().fetchProducts();
  },

  setFilterCategory: (val) => {
    set({ filterCategory: val });
    get().fetchProducts();
  },

  setFilterPrice: (val) => {
    set({ filterPrice: val });
    get().fetchProducts();
  },

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const { filterSearch, filterCategory, filterPrice } = get();
      let priceSort: "asc" | "desc" | undefined;
      if (filterPrice === "low-to-high") priceSort = "asc";
      else if (filterPrice === "high-to-low") priceSort = "desc";

      const res = await getFilteredProduct(
        filterSearch,
        filterCategory as ProductCategory,
        priceSort
      );
      set({ products: res });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  fetchIndividualProduct: async (productId) => {
    try {
      set({ loadingIndividualProduct: true });
      const product = await getProductDetails(productId);
      set({ individualProduct: product });
    } catch (error) {
      console.log(error);
    } finally {
      set({ loadingIndividualProduct: false });
    }
  },
}));

export default useProductStore;
