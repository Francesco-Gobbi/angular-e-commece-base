import { Product } from './product.model';

export interface Cart {
  _id: string;
  products: Item[];
}

export interface Item {
  _id: String;
  product: Product;
  quantity: number;
}
