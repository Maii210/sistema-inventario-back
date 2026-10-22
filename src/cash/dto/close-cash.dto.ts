import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CloseCashDto {
  @IsNumber()
  @Min(0)
  countedAmount!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  qrCounted?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  expectedCashManual?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  expectedQrManual?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  leftInCash?: number;

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
