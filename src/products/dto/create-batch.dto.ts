import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';

export class CreateBatchDto {
  @IsInt()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}
