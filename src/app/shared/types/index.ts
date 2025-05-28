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
  createdAt?: Date;
  updatedAt?: Date;
};

export type Products = {
  _id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  category?: Categories;
  stock: number;
  imageUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Categories = {
  _id: string;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Order = {
  _id: string;
  orderNumber: string;
  userId: string;
  user?: User;
  totalAmount: number;
  status: OrderStatuses;
  items: OrderItems[];
  createdAt?: Date;
  updatedAt?: Date;
};

export enum OrderStatuses {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export type OrderItems = {
  _id: string;
  name: string;
  orderId: string;
  order?: Order;
  productId: string;
  product: Products;
  quantity: number;
  price: number;
};

export type Cart = {
  products: CartItem[];
};

export type CartItem = Products & {
  quantity: number;
};
