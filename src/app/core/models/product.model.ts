export interface Product {
  name: string;
  description: string;
  price: 10;
  categoryId: string;
  stock: 10;
  imageUrl: string;
  _id: string;
  category: {
    _id: string;
    name: string;
    description: string;
  };
}
