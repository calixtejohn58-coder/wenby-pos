export class CreateProductDto {
  name: string;
  description?: string;
 barcode?: string;
  price: number;
  stock: number;
  image?: string;
}