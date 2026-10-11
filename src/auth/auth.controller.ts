import { Controller, Post, Body, ValidationPipe, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsString, MinLength } from 'class-validator';

class LoginBody {
  @IsString()
  @MinLength(1)
  email!: string;

  @IsString()
  @MinLength(1)
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('login')
  async login(@Body(ValidationPipe) body: LoginBody) {
    const id = body.email.trim();
    const user = await this.prisma.staffUser.findFirst({
      where: { OR: [{ email: id }, { phone: id }] },
    });

    if (!user || user.password !== body.password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    if (!user.active) {
      throw new UnauthorizedException('Usuario desactivado');
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        active: user.active,
      },
    };
  }
}
