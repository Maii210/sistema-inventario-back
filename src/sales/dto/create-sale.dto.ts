import { IsString, IsNumber, IsOptional, IsEnum, IsArray, IsBoolean } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

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
  @IsOptional() @IsString() productId?: string;
  @IsString() name!: string;
  @IsNumber() price!: number;
  @IsNumber() quantity!: number;
  @IsOptional() @IsNumber() discount?: number;
  @IsOptional() @IsBoolean() isExternal?: boolean;
  @IsOptional() @IsNumber() externalCost?: number;
}
