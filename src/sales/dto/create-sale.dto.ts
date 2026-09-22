import { IsString, IsNumber, IsOptional, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { PaymentMethod } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateSaleDto {
  @IsOptional() @IsString() customerId?: string;
  @IsOptional() @IsString() userId?: string;
  @IsOptional() @IsString() customerName?: string;
  @IsOptional() @IsString() customerEmail?: string;
  @IsOptional() @IsString() customerPhone?: string;
  @IsOptional() @IsEnum(PaymentMethod) paymentMethod?: PaymentMethod;
  @IsOptional() @IsNumber() discount?: number;
  @IsOptional() @IsString() paymentReference?: string;
  @IsArray() items: SaleItemDto[];
}

export class SaleItemDto {
  @IsString() productId!: string;
  @IsString() name!: string;
  @IsNumber() price!: number;
  @IsNumber() quantity!: number;
  @IsOptional() @IsNumber() discount?: number;
}
