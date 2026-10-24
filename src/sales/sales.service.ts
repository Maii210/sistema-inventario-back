import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.sale.findMany({ 
      orderBy: { createdAt: 'desc' },
      include: { items: true, customer: true, user: true }
    });
  }

  async findOne(id: string) {
    const sale = await this.prisma.sale.findUnique({ 
      where: { id },
      include: { items: true, customer: true, user: true }
    });
    if (!sale) throw new NotFoundException(`Venta ${id} no encontrada`);
    return sale;
  }

  async create(dto: CreateSaleDto) {
    // No se permiten ventas si no hay una caja abierta (arqueo cerrado).
    const openSession = await this.prisma.cashSession.findFirst({ where: { status: 'open' } });
    if (!openSession) {
      throw new BadRequestException('La caja está cerrada. Abre la caja antes de registrar ventas.');
    }

    const { items, ...rest } = dto;
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal - (rest.discount || 0);
    const sale = await this.prisma.$transaction(async (tx) => {
      const productIds = [...new Set(items.flatMap((item) =>
        item.productId && !item.isExternal ? [item.productId] : [],
      ))];
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, purchasePrice: true },
      });
      const productCosts = new Map(products.map((product) => [product.id, product.purchasePrice]));

      const newSale = await tx.sale.create({
        data: {
          // Se usan relaciones (connect) en lugar de los FK escalares: asignar
          // `customerId: null`/`productId: null` provocaba "Unknown argument".
          customerName: rest.customerName || 'Consumidor final',
          customerEmail: rest.customerEmail ?? null,
          customerPhone: rest.customerPhone ?? null,
          discount: rest.discount ?? 0,
          paymentMethod: rest.paymentMethod ?? 'efectivo',
          paymentReference: rest.paymentReference ?? null,
          subtotal,
          total,
          ...(rest.customerId ? { customer: { connect: { id: rest.customerId } } } : {}),
          ...(rest.userId ? { user: { connect: { id: rest.userId } } } : {}),
        },
      });

      for (const item of items) {
        await tx.saleItem.create({
          data: {
            sale: { connect: { id: newSale.id } },
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            discount: item.discount || 0,
            isExternal: item.isExternal || false,
            externalCost: item.externalCost ?? null,
            unitCost: item.isExternal
              ? item.externalCost ?? null
              : item.productId
                ? productCosts.get(item.productId) ?? null
                : null,
            ...(item.productId ? { product: { connect: { id: item.productId } } } : {}),
          },
        });

        // Solo descuenta stock de productos propios (no de prestados/externos).
        if (item.productId && !item.isExternal) {
          const productId = item.productId;
          // FEFO: descuenta primero de los lotes que vencen antes.
          const batches = await tx.productBatch.findMany({
            where: { productId },
            orderBy: [{ expiryDate: 'asc' }, { createdAt: 'asc' }],
          });
          if (batches.length === 0) {
            // Producto sin lotes (legado): descuento directo.
            await tx.product.update({ where: { id: productId }, data: { stock: { decrement: item.quantity } } });
          } else {
            let remaining = item.quantity;
            for (const b of batches) {
              if (remaining <= 0) break;
              const take = Math.min(b.quantity, remaining);
              await tx.productBatch.update({ where: { id: b.id }, data: { quantity: { decrement: take } } });
              remaining -= take;
            }
            await tx.productBatch.deleteMany({ where: { productId, quantity: { lte: 0 } } });
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
      }
      
      return newSale;
    });
    return sale;
  }

  async update(id: string, dto: UpdateSaleDto) {
    await this.findOne(id);
    const { items, ...rest } = dto;
    const data: Record<string, unknown> = {};
    if (rest.customerId !== undefined) data.customerId = rest.customerId;
    if (rest.userId !== undefined) data.userId = rest.userId;
    if (rest.customerName !== undefined) data.customerName = rest.customerName;
    if (rest.customerEmail !== undefined) data.customerEmail = rest.customerEmail;
    if (rest.customerPhone !== undefined) data.customerPhone = rest.customerPhone;
    if (rest.paymentMethod !== undefined) data.paymentMethod = rest.paymentMethod;
    if (rest.discount !== undefined) data.discount = rest.discount;
    if (rest.paymentReference !== undefined) data.paymentReference = rest.paymentReference;
    return this.prisma.sale.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.sale.delete({ where: { id } });
  }
}
