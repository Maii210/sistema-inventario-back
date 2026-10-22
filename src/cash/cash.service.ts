import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OpenCashDto } from './dto/open-cash.dto';
import { CloseCashDto } from './dto/close-cash.dto';

@Injectable()
export class CashService {
  constructor(private readonly prisma: PrismaService) {}

  // Totales de ventas en la ventana de la sesión, agrupados por método de pago.
  private async sessionTotals(openedAt: Date, closedAt?: Date | null) {
    const sales = await this.prisma.sale.findMany({
      where: { createdAt: { gte: openedAt, ...(closedAt ? { lte: closedAt } : {}) } },
      include: { user: true },
    });
    const byMethod: Record<string, number> = {};
    const discountsBySellerMap: Record<string, { sellerId: string | null; sellerName: string; count: number; total: number; discount: number }> = {};
    let total = 0;
    let discount = 0;
    for (const s of sales) {
      byMethod[s.paymentMethod] = (byMethod[s.paymentMethod] || 0) + s.total;
      total += s.total;
      discount += s.discount;
      const key = s.userId || 'sin-asignar';
      if (!discountsBySellerMap[key]) {
        const name = s.user ? `${s.user.name}${s.user.lastName ? ` ${s.user.lastName}` : ''}` : 'Sin asignar';
        discountsBySellerMap[key] = { sellerId: s.userId, sellerName: name, count: 0, total: 0, discount: 0 };
      }
      discountsBySellerMap[key].count += 1;
      discountsBySellerMap[key].total += s.total;
      discountsBySellerMap[key].discount += s.discount;
    }
    return { count: sales.length, total, discount, byMethod, discountsBySeller: Object.values(discountsBySellerMap) };
  }

  private withTotals = async (session: any) => {
    const totals = await this.sessionTotals(session.openedAt, session.closedAt);
    const expectedCash = session.openingAmount + (totals.byMethod['efectivo'] || 0);
    const difference = session.countedAmount != null ? session.countedAmount - expectedCash : null;
    return { ...session, totals, expectedCash, difference };
  };

  async current() {
    const session = await this.prisma.cashSession.findFirst({
      where: { status: 'open' },
      orderBy: { openedAt: 'desc' },
    });
    if (!session) return null;
    return this.withTotals(session);
  }

  async history() {
    const sessions = await this.prisma.cashSession.findMany({ orderBy: { openedAt: 'desc' } });
    return Promise.all(sessions.map((s) => this.withTotals(s)));
  }

  async open(dto: OpenCashDto) {
    const existing = await this.prisma.cashSession.findFirst({ where: { status: 'open' } });
    if (existing) throw new ConflictException('Ya hay una caja abierta. Ciérrala antes de abrir otra.');
    return this.prisma.cashSession.create({
      data: {
        openingAmount: dto.openingAmount,
        openedById: dto.openedById || null,
        openedByName: dto.openedByName || null,
      },
    });
  }

  async close(id: string, dto: CloseCashDto) {
    const session = await this.prisma.cashSession.findUnique({ where: { id } });
    if (!session) throw new NotFoundException(`Caja ${id} no encontrada`);
    if (session.status === 'closed') throw new ConflictException('Esta caja ya está cerrada.');
    const updated = await this.prisma.cashSession.update({
      where: { id },
      data: {
        status: 'closed',
        closedAt: new Date(),
        countedAmount: dto.countedAmount,
        qrCounted: dto.qrCounted ?? null,
        expectedCashManual: dto.expectedCashManual ?? null,
        expectedQrManual: dto.expectedQrManual ?? null,
        leftInCash: dto.leftInCash ?? null,
        closedById: dto.closedById || null,
        closedByName: dto.closedByName || null,
        notes: dto.notes || null,
      },
    });
    return this.withTotals(updated);
  }
}
