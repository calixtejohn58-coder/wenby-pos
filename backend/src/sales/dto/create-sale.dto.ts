export class CreateSaleDto {
  items: {
    productId: string;
    quantity: number;
  }[];
}