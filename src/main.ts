import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Permite que el frontend (otro origen) consuma la API.
  app.enableCors();

  // Prefijo común para todos los endpoints: /api
  app.setGlobalPrefix('api');

  // Valida y transforma los DTO de entrada automáticamente.
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true })
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Backend Comercial Camila escuchando en http://localhost:${port}/api`);
}
bootstrap();
