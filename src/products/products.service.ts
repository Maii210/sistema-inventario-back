import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(`Producto ${id} no encontrado`);
    return product;
  }

  create(dto: CreateProductDto) {
    const { supplierId, ...data } = dto as any;
    return this.prisma.product.create({ data: { ...data, supplierId: supplierId || null } });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    const { supplierId, ...data } = dto as any;
    return this.prisma.product.update({ where: { id }, data: { ...data, supplierId: supplierId || undefined } });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.product.delete({ where: { id } });
    return { id, deleted: true };
  }
}
