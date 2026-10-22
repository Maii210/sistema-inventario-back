import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateBatchDto } from './dto/create-batch.dto';

const withBatches = { batches: { orderBy: { expiryDate: 'asc' as const } } };

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany({ orderBy: { createdAt: 'desc' }, include: withBatches });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id }, include: withBatches });
    if (!product) throw new NotFoundException(`Producto ${id} no encontrado`);
    return product;
  }

  create(dto: CreateProductDto) {
    const { supplierId, ...data } = dto as any;
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({ data: { ...data, supplierId: supplierId || null } });
      const qty = Number(data.stock) || 0;
      // El stock inicial se guarda como el primer lote del producto.
      if (qty > 0) {
        await tx.productBatch.create({
          data: { productId: product.id, quantity: qty, expiryDate: data.expiryDate ? new Date(data.expiryDate) : null },
        });
      }
      return product;
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    const { supplierId, ...data } = dto as any;
    // stock y expiryDate son derivados de los lotes: no se editan desde el producto.
    delete data.stock;
    delete data.expiryDate;
    return this.prisma.product.update({ where: { id }, data: { ...data, supplierId: supplierId || undefined }, include: withBatches });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.product.delete({ where: { id } });
    return { id, deleted: true };
  }

  // ─── Lotes ───────────────────────────────────────────────
  async addBatch(productId: string, dto: CreateBatchDto) {
    await this.findOne(productId);
    return this.prisma.$transaction(async (tx) => {
      await tx.productBatch.create({
        data: { productId, quantity: dto.quantity, expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null },
      });
      await this.syncProduct(tx, productId);
      return tx.product.findUnique({ where: { id: productId }, include: withBatches });
    });
  }

  async removeBatch(productId: string, batchId: string) {
    await this.findOne(productId);
    return this.prisma.$transaction(async (tx) => {
      await tx.productBatch.deleteMany({ where: { id: batchId, productId } });
      await this.syncProduct(tx, productId);
      return tx.product.findUnique({ where: { id: productId }, include: withBatches });
    });
  }

  // Recalcula el stock (suma de lotes) y la fecha de caducidad (la más próxima).
  private async syncProduct(tx: any, productId: string) {
    const agg = await tx.productBatch.aggregate({ where: { productId }, _sum: { quantity: true } });
    const earliest = await tx.productBatch.findFirst({
      where: { productId, expiryDate: { not: null } },
      orderBy: { expiryDate: 'asc' },
    });
    await tx.product.update({
      where: { id: productId },
      data: { stock: agg._sum.quantity ?? 0, expiryDate: earliest?.expiryDate ?? null },
    });
  }
}
