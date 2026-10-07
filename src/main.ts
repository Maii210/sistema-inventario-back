import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // El QR/comprobante/imágenes viajan como base64: ampliar el límite del body.
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

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
