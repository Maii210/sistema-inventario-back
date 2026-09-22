import { Injectable, NotFoundException } from '@nestjs/common';
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
    const { items, ...rest } = dto;
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal - (rest.discount || 0);
    const sale = await this.prisma.$transaction(async (tx) => {
      const newSale = await tx.sale.create({ 
        data: { 
          ...rest, 
          subtotal, 
          total 
        } 
      });
      
      for (const item of items) {
        await tx.saleItem.create({
          data: {
            saleId: newSale.id,
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            discount: item.discount || 0
          }
        });
        
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
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
