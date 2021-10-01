export interface Product {
  name: string;
  description: string;
  image: string;
  key: string;
}

export interface Vote {
  product: Product["key"];
  user: string;
  comment?: string;
}
