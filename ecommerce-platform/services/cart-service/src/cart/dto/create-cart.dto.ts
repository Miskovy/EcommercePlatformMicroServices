import { IsString, IsInt, Min, IsNotEmpty, IsNumber } from 'class-validator';

export class AddToCartDto {
  @IsString()
  @IsNotEmpty()
  userId: string; // Depending on your auth, this might come from the token, but for now we'll accept it explicitly

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  price: number; // We pass the price from the frontend (or fetch it from Product Service in a real scenario)
}