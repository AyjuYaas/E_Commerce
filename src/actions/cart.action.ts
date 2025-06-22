"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AddToCartData } from "@/types/cart.types";

export async function addToCart({ productId, quantity }: AddToCartData) {
  try {
    const session = await getSession();

    // Validate Session and User
    if (!session) {
      return { success: false, error: "You must log in to add to cart" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!existingUser) {
      return { success: false, error: "User not found" };
    }

    // Parse the Quantity to number
    const parsedQuantity =
      typeof quantity === "string" ? parseInt(quantity) : quantity;

    // Find the product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    // Find if the item is already on cart
    const existingCartItem = await prisma.cart.findFirst({
      where: {
        userId: session.user.id,
        productId,
      },
    });

    // If on cart then just increase the quantity
    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + parsedQuantity;

      // if the quantity exceeds the available stock
      if (newQuantity > product.quantity) {
        return { success: false, error: "Stock not available" };
      }

      // If the quantity decreases
      if (newQuantity < 1) {
        return { success: false, error: "Cannot decrease anymore" };
      }

      await prisma.cart.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
      });
      return { success: true, message: "Updated cart item" };
    } else {
      // Else Create a new cart

      // Check for the stock
      if (parsedQuantity > product.quantity) {
        return { success: false, error: "Stock not available" };
      }

      if (parsedQuantity < 1) {
        return { success: false, error: "Quantity cannot be less than 1" };
      }

      await prisma.cart.create({
        data: {
          userId: session.user.id,
          productId,
          quantity: parsedQuantity,
        },
      });

      return { success: true, message: "Product added to cart successfully" };
    }
  } catch (error) {
    console.log("Failed to add to cart: ", error);
    return { success: false, error: "Failed to add to cart" };
  }
}

export async function getNumberOfCartItems() {
  try {
    const session = await getSession();

    if (!session) {
      return { success: false, message: "User not signed in" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!existingUser) {
      return { success: false, error: "User not found" };
    }

    const itemCount = await prisma.cart.count({
      where: {
        userId: session.user.id,
      },
    });

    return { success: true, count: itemCount };
  } catch (error) {
    console.log("Error in get number of cart items action: ", error);
    return { success: false, error: "Cannot fetch cart items" };
  }
}

export async function viewCartItems() {
  try {
    const session = await getSession();

    if (!session) {
      return { success: false, error: "User is not logged in" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!existingUser) {
      return { success: false, error: "User not found" };
    }

    const cartItems = await prisma.cart.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: {
            name: true,
            image: true,
            price: true,
            quantity: true,
          },
        },
      },
    });

    return { success: true, cartItems };
  } catch (error) {
    console.log("Error in view cart items action: ", error);
    return { success: false, error: "Cannot fetch cart items" };
  }
}

export async function updateCartItem({ productId, quantity }: AddToCartData) {
  try {
    const session = await getSession();

    // Validate Session and User
    if (!session) {
      return { success: false, error: "You must log in to add to cart" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!existingUser) {
      return { success: false, error: "User not found" };
    }

    // Parse the Quantity to number
    const parsedQuantity =
      typeof quantity === "string" ? parseInt(quantity) : quantity;

    // Find the product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    // Find if the item is already on cart
    const existingCartItem = await prisma.cart.findFirst({
      where: {
        userId: session.user.id,
        productId,
      },
    });

    // If on cart then just increase the quantity
    if (!existingCartItem) {
      return { success: false, error: "Cart item does not exist" };
    }

    // if the quantity exceeds the available stock
    if (parsedQuantity > product.quantity) {
      return { success: false, error: "Stock not available" };
    }

    // If the quantity decreases
    if (parsedQuantity < 1) {
      return { success: false, error: "Cannot decrease anymore" };
    }

    await prisma.cart.update({
      where: { id: existingCartItem.id },
      data: { quantity: parsedQuantity },
    });
    return { success: true, message: "Updated cart item" };
  } catch (error) {
    console.log("Failed to update cart items: ", error);
    return { success: false, error: "Failed to add to cart" };
  }
}

export async function deleteCartItem(cartId: string) {
  try {
    const session = await getSession();

    if (!session) {
      return { success: false, error: "User not logged in" };
    }

    const cartItem = await prisma.cart.findUnique({
      where: { id: cartId, userId: session.user.id },
    });

    if (!cartItem) {
      return { success: false, error: "Items not linked to your cart" };
    }

    await prisma.cart.delete({
      where: { id: cartId },
    });
    return { success: true, message: "Successfully removed from your cart" };
  } catch (error) {
    console.log("Error in Delete Cart Item ", error);
    return { success: false, error: "Something went wrong while deleting" };
  }
}
