"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface PlaceOrderProps {
  location: string;
  phone: string;
  data: string;
}

interface PostReviewProps {
  rating: number;
  review: string;
  productId: string;
}

export async function placeOrder({ location, phone, data }: PlaceOrderProps) {
  try {
    const session = await getSession();

    if (!session) {
      return { success: false, error: "No user authenticated" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (!location || !phone) {
      return { success: false, error: "All fields are required" };
    }

    // Decode and parse eSewa data
    let esewa_obj;
    try {
      const decoded = atob(data);
      esewa_obj = JSON.parse(decoded);
    } catch (error) {
      console.log(error);
      return { success: false, error: "Invalid eSewa data" };
    }

    if (esewa_obj.status !== "COMPLETE") {
      return { success: false, error: "Payment incomplete" };
    }

    const cartItems = await prisma.cart.findMany({
      where: { userId: user.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return { success: false, error: "Cart is empty" };
    }

    // Step 1: Validate stock
    for (const item of cartItems) {
      if (item.quantity > item.product.quantity) {
        return {
          success: false,
          error: `Only ${item.product.quantity} left in stock for ${item.product.name}`,
        };
      }
    }

    // Step 2: Transactional Order + OrderItems + Payment + Decrease Stock + Clear Cart
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const createdOrder = await tx.order.create({
        data: {
          userId: user.id,
          location,
          phone,
          totalAmount: Number(esewa_obj.total_amount),
          status: "DELIVERED",
        },
      });

      // Create order items and update product quantity
      for (const item of cartItems) {
        await tx.orderItem.create({
          data: {
            orderId: createdOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          },
        });

        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Create payment (optional)
      await tx.payment.create({
        data: {
          orderId: createdOrder.id,
          transactionId: esewa_obj.transaction_code,
          amount: Number(esewa_obj.total_amount),
          status: "PAID",
        },
      });

      // Clear cart
      await tx.cart.deleteMany({
        where: { userId: user.id },
      });

      return { success: true, createdOrder };
    });

    return { success: true, message: "Order placed successfully", order };
  } catch (error) {
    console.log("Error in placeOrder: ", error);
    return {
      success: false,
      error: "Something went wrong while placing order",
    };
  }
}

export async function viewOrder() {
  try {
    const session = await getSession();

    if (!session) {
      return { success: false, error: "No user authenticated" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        userId: true,
        totalAmount: true,
        location: true,
        phone: true,
        status: true,
        createdAt: true,
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, orders };
  } catch (error) {
    console.log("Error in placeOrder: ", error);
    return {
      success: false,
      error: "Something went wrong while placing order",
    };
  }
}

export async function postReview({
  rating,
  review,
  productId,
}: PostReviewProps) {
  try {
    const session = await getSession();

    if (!session) {
      return { success: false, error: "No user authenticated" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    await prisma.review.upsert({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
      update: {
        comment: review,
        rating: rating,
      },
      create: {
        userId: user.id,
        productId,
        comment: review,
        rating: rating,
      },
    });

    return { success: true, message: "Reviewed Successfully" };
  } catch (error) {
    console.log("Error in placeOrder: ", error);
    return {
      success: false,
      error: "Something went wrong while posting your review",
    };
  }
}

export async function getUserReview(productId: string) {
  try {
    const session = await getSession();

    if (!session) {
      return { success: false, error: "No user authenticated" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const review = await prisma.review.findFirst({
      where: {
        userId: user.id,
        productId,
      },
      select: {
        id: true,
        rating: true,
        comment: true,
      },
    });

    if (!review) {
      return { success: false, error: "No reviews yet" };
    }

    return {
      success: true,
      review,
    };
  } catch (error) {
    console.log("Error in Get user review for product: ", error);
    return {
      success: false,
      error: "Something went wrong while fetching your review",
    };
  }
}
