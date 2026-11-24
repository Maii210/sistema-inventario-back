import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateBatchDto {
  @IsInt()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}
