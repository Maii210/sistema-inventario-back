// Migración de datos: crea un lote inicial para cada producto existente que
// tenga stock > 0 y aún no tenga lotes (usa su fecha de caducidad actual).
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const products = await prisma.product.findMany({ include: { batches: true } });
  let created = 0;
  for (const p of products) {
    if (p.batches.length === 0 && p.stock > 0) {
      await prisma.productBatch.create({
        data: { productId: p.id, quantity: p.stock, expiryDate: p.expiryDate },
      });
      created++;
    }
  }
  console.log(`Lotes iniciales creados para ${created} producto(s).`);
  await prisma.$disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
