interface OrderItem {
  id: string;
  price: number;
  quantity: number;
  product: {
    id: string;
    image: string;
    name: string;
    price: number;
  };
}

export interface UserOrderTypes {
  id: string;
  userId: string;
  location: string;
  phone: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt: Date;
}
