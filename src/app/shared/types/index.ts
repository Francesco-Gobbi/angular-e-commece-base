export type User = {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Products = {
  _id: string;
  name: string;
  description: string;
  price: string;
  categoryId: string;
  stock: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Categories = {
  _id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Orders = {
  _id: string;
  orderNumber: string;
  userId: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderItems = {
  _id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}
