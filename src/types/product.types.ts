import { $Enums } from "@/generated/prisma";

export type ProductCategory =
  | "SHOES"
  | "ELECTRONICS"
  | "CLOTHES"
  | "GROCERIES"
  | "BOOKS"
  | "FURNITURE"
  | "BEAUTY"
  | "PETSUPPLIES";

export interface RegisterProduct {
  name: string;
  category: ProductCategory | undefined;
  price: number;
  quantity: number;
  description: string;
  image: string;
}

export interface HomeProductType {
  id: string;
  image: string;
  name: string;
  category: $Enums.ProductCategory;
  price: number;
}

export interface ProductDetailsType {
  id: string;
  name: string;
  image: string;
  category: $Enums.ProductCategory;
  price: number;
  quantity: number;
  description: string;
}
