// Genera un código de barras interno para los productos que no tengan uno.
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function generateBarcode() {
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return '200' + Date.now().toString().slice(-7) + rand;
}

(async () => {
  const products = await prisma.product.findMany({ where: { OR: [{ barcode: null }, { barcode: '' }] } });
  let updated = 0;
  for (const p of products) {
    let code = generateBarcode();
    // Evita colisiones improbables.
    while (await prisma.product.findUnique({ where: { barcode: code } })) code = generateBarcode();
    await prisma.product.update({ where: { id: p.id }, data: { barcode: code } });
    updated++;
  }
  console.log(`Códigos generados para ${updated} producto(s) sin código.`);
  await prisma.$disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
