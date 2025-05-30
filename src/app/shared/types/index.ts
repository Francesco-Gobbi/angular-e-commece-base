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

export interface PaginatedOrdersResponse {
  orders: Order[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface OrdersQueryParams {
  page?: number;
  limit?: number;
  sort?: string[];
  fields?: string[];
  [key: string]: any;
}


export interface DashboardMetrics {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  averageOrderValue: number;
}

export interface SalesByDay {
  date: string;
  sales: number;
  orders: number;
}

export interface SalesByCategory {
  category: string;
  sales: number;
  percentage: number;
}

export interface RecentOrder {
  id: string;
  orderNumber: number;
  customerName: string;
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface ApiQueryParams {
  page?: number;
  limit?: number;
  sort?: string[];
  fields?: string[];
  [key: string]: any;
}

export interface OrdersResponse {
  data: Order[];
  total: number;
}

export interface UsersResponse {
  data: User[];
  total: number;
}
