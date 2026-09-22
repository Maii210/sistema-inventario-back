import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsString, IsEmail } from 'class-validator';

class LoginBody {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('login')
  async login(@Body(ValidationPipe) body: LoginBody) {
    const user = await this.prisma.staffUser.findUnique({
      where: { email: body.email }
    });
    
    if (!user) {
      return { success: false, message: 'Credenciales inválidas' };
    }
    
    const isValid = user.password === body.password;
    
    if (!isValid) {
      return { success: false, message: 'Credenciales inválidas' };
    }
    
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active
      }
    };
  }
}
