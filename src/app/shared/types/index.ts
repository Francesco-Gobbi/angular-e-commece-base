export type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  isConfirmed: boolean;
  isEnabled: boolean;
  isDeleted: boolean;
  lastLogin: Date;
  preLastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type Products = {
  _id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
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
  status: OrderStatuses;
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderStatuses {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export type OrderItems = {
  _id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}
