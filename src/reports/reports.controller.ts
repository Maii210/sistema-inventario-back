import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('inventory')
  async inventoryReport(@Query('period') period?: string) {
    const products = await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { supplier: true }
    });
    
    const inventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const totalMargin = products.reduce((sum, p) => {
      const cost = p.purchasePrice || 0;
      return sum + ((p.price - cost) * p.stock);
    }, 0);
    
    return {
      totalProducts: products.length,
      totalValue: inventoryValue,
      totalMargin,
      lowStock: products.filter(p => p.stock < (p.minStock || 10)).length,
      period: period || 'all',
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        stock: p.stock,
        minStock: p.minStock,
        price: p.price,
        purchasePrice: p.purchasePrice,
        margin: (p.price - (p.purchasePrice || 0)) * p.stock,
        value: p.price * p.stock,
        supplier: p.supplier ? p.supplier.name : null
      }))
    };
  }

  @Get('sales')
  async salesReport(@Query('period') period?: string) {
    const sales = await this.prisma.sale.findMany({
      orderBy: { date: 'desc' },
      include: { items: true }
    });
    
    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
    const totalSales = sales.length;
    const avgTicket = totalSales ? Math.round(totalRevenue / totalSales) : 0;
    
    return {
      totalRevenue,
      totalSales,
      avgTicket,
      period: period || 'all',
      sales: sales.map(s => ({
        id: s.id,
        date: s.date,
        total: s.total,
        discount: s.discount,
        paymentMethod: s.paymentMethod,
        paymentReference: s.paymentReference,
        customerName: s.customerName,
        items: s.items.map(i => ({
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          discount: i.discount
        }))
      }))
    };
  }

  @Get('customers')
  async customersReport() {
    const customers = await this.prisma.customer.findMany({
      include: { sales: true }
    });
    
    const customerRows = customers.map(c => ({
      id: c.id,
      name: c.name,
      lastName: c.lastName,
      email: c.email,
      phone: c.phone,
      documentId: c.documentId,
      totalOrders: c.sales.length,
      totalSpent: c.sales.reduce((sum, s) => sum + s.total, 0)
    }));
    
    return customerRows.sort((a, b) => b.totalSpent - a.totalSpent);
  }

  @Get('suppliers')
  async suppliersReport() {
    const suppliers = await this.prisma.supplier.findMany({
      include: { products: true }
    });
    
    return suppliers.map(s => ({
      id: s.id,
      name: s.name,
      contactName: s.contactName,
      phone: s.phone,
      email: s.email,
      productCount: s.products.length,
      products: s.products.map(p => ({ id: p.id, name: p.name, category: p.category }))
    }));
  }
}
