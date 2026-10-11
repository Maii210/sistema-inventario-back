import { IsString, IsEmail, IsOptional, IsEnum, IsBoolean, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsString() @MinLength(1) name!: string;
  @IsString() @MinLength(1) lastName!: string;
  @IsOptional() @IsEmail() email?: string;
  @IsString() @MinLength(4) password!: string;
  @IsOptional() @IsEnum(Role) role?: Role;
  @IsOptional() @IsBoolean() active?: boolean;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() documentId?: string;
}
