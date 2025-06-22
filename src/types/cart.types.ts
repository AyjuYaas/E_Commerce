export interface AddToCartData {
  productId: string;
  quantity: number;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product: {
    name: string;
    image: string;
    price: number;
    quantity: number;
  };
}
