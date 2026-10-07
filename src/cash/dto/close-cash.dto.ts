import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CloseCashDto {
  @IsNumber()
  @Min(0)
  countedAmount!: number;

  @IsOptional()
  @IsString()
  closedById?: string;

  @IsOptional()
  @IsString()
  closedByName?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
