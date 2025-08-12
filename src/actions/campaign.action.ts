"use server";

import { prisma } from "@/lib/prisma";
import { subDays } from "date-fns";
import nodemailer from "nodemailer";

// Existing inactive users function
export async function InactiveUsers(productId: string, days: number = 30) {
  const cutoff = subDays(new Date(), Number(days));

  try {
    const users = await prisma.user.findMany({
      where: {
        orders: {
          none: {
            createdAt: { gte: cutoff },
            // items: { some: { productId: String(productId) } },
          },
        },
      },
      select: { id: true, name: true, email: true },
    });
    return { success: true, users };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to fetch inactive users" };
  }
}

// New function for high-value customers
export async function HighValueCustomers(days: number = 20) {
  const cutoff = subDays(new Date(), Number(days));

  try {
    const users = await prisma.user.findMany({
      where: {
        orders: {
          some: {
            createdAt: { gte: cutoff },
            status: "DELIVERED",
            totalAmount: { gte: 99 }, // Adjust threshold as needed
          },
        },
      },
      select: { id: true, name: true, email: true },
    });
    return { success: true, users };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to fetch high-value customers" };
  }
}

// Updated email function to handle both segments
export async function SendCampaignEmail({
  productId,
  userIds,
  campaignType,
}: {
  productId: string;
  userIds: string[];
  campaignType: "inactive" | "highValue";
}) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: String(productId) },
    });
    if (!product) {
      return { success: false, error: "Product not found" };
    }

    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { name: true, email: true },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    for (const user of users) {
      const subject =
        campaignType === "inactive"
          ? `🔥 ${product.name} - Special Comeback Offer!`
          : `🎁 Exclusive Offer for You: ${product.name}`;

      await transporter.sendMail({
        from: `"ShopX" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject,
        html: `
          <h1>Hey ${user.name || "Valued Customer"},</h1>
          <p>${
            campaignType === "inactive"
              ? `We miss you! Enjoy this special offer on ${product.name}`
              : `As one of our best customers, we're offering you early access to ${product.name}`
          }</p>
          <a href="https://localhost:3000/product/${product.id}">Shop Now</a>
        `,
      });
    }
    return { success: true, message: `Emails sent to ${users.length} users` };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to send campaign" };
  }
}
