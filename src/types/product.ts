export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  images: string[];
  inStock: boolean;
  badge?: string;
  rating?: number;
  reviews?: number;

}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
}