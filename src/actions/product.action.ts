"use server";

import { $Enums } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { HomeProductType, RegisterProduct } from "@/types/product.types";

export async function addProduct({
  name,
  category,
  price,
  image,
  description,
  quantity,
}: RegisterProduct) {
  try {
    const parsedPrice = typeof price === "string" ? parseFloat(price) : price;
    const parsedQuantity =
      typeof quantity === "string" ? parseInt(quantity) : quantity;

    if (!name || !price || !image || !description || !quantity || !category) {
      return { success: false, error: "All Fields are required" };
    }

    if (price <= 0) {
      return { success: false, error: "Price cannot be less than 0" };
    }
    if (quantity <= 0) {
      return { success: false, error: "Quantity cannot be less than 0" };
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parsedPrice,
        image,
        category: category,
        description,
        quantity: parsedQuantity,
      },
    });

    return {
      success: true,
      product: newProduct,
    };
  } catch (error) {
    console.log("Failed to Add Product: ", error);
    return { success: false, error: "Failed to Add Product" };
  }
}

export async function getFilteredProduct(
  search?: string,
  category?: $Enums.ProductCategory,
  priceSort?: "asc" | "desc"
) {
  try {
    const products: HomeProductType[] = await prisma.product.findMany({
      where: {
        name: search
          ? {
              contains: search,
              mode: "insensitive",
            }
          : undefined,
        category: category || undefined,
      },
      orderBy: priceSort
        ? {
            price: priceSort,
          }
        : undefined,

      select: {
        id: true,
        name: true,
        price: true,
        image: true,
        category: true,
      },
    });
    return products;
  } catch (error) {
    console.log("Error in getFilteredProduct: ", error);
    throw new Error("Failed to fetch filtered products");
  }
}

export async function getProductDetails(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    return product;
  } catch (error) {
    console.log("Error in getFilteredProduct: ", error);
    throw new Error("Failed to fetch filtered products");
  }
}
