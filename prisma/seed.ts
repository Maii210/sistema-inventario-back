import { PrismaClient, Role, PaymentMethod, Category } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sembrando datos de prueba...\n');

  // ── Proveedores ──────────────────────────────────────────
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: {
        name: 'Distribuidora Bella Essence',
        contactName: 'María Gonzales',
        phone: '70123456',
        email: 'contacto@bellaessence.com',
        notes: 'Proveedor principal de perfumes importados',
      },
    }),
    prisma.supplier.create({
      data: {
        name: 'Cosméticos Premium SRL',
        contactName: 'Carlos Mendoza',
        phone: '70234567',
        email: 'ventas@cosmeticspremium.com',
        notes: 'Línea de maquillaje y cuidado facial',
      },
    }),
    prisma.supplier.create({
      data: {
        name: 'Importadora Real',
        contactName: 'Ana López',
        phone: '70345678',
        email: 'pedidos@importadorareal.com',
        notes: 'Accesorios y productos de higiene personal',
      },
    }),
    prisma.supplier.create({
      data: {
        name: 'Industria Cosmética Boliviana',
        contactName: 'Roberto Fernández',
        phone: '70456789',
        email: 'info@icb.com.bo',
        notes: 'Productos nacionales, buena calidad-precio',
      },
    }),
    prisma.supplier.create({
      data: {
        name: 'Fragancias del Mundo',
        contactName: 'Lucía Gutiérrez',
        phone: '70567890',
        email: 'contacto@fraganciasdelmundo.com',
        notes: 'Perfumes arabes y europeos',
      },
    }),
  ]);
  console.log(`✅ ${suppliers.length} proveedores creados`);

  // ── Productos ────────────────────────────────────────────
  const products = await Promise.all([
    // PERFUMERÍA
    prisma.product.create({
      data: {
        name: 'Perfume Miss Dior Blooming Bouquet',
        brand: 'Dior',
        category: Category.PERFUMERIA,
        price: 650,
        purchasePrice: 380,
        stock: 15,
        minStock: 3,
        barcode: '3348901542195',
        description: 'Fragancia floral fresca. Notas de peonía, mosqueta y calabaza almizclada. 100ml.',
        supplierId: suppliers[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Perfume Chanel No. 5',
        brand: 'Chanel',
        category: Category.PERFUMERIA,
        price: 890,
        purchasePrice: 520,
        stock: 8,
        minStock: 2,
        barcode: '3145891162081',
        description: 'Icono de elegancia. Aldehidos, jazmín, rosa, sándalo. 100ml EDP.',
        supplierId: suppliers[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Perfume Carolina Herrera Good Girl',
        brand: 'Carolina Herrera',
        category: Category.PERFUMERIA,
        price: 580,
        purchasePrice: 340,
        stock: 12,
        minStock: 3,
        barcode: '8411601010012',
        description: 'Fragancia oriental floral. Notas de jazmín, haba tonka, cacao. 80ml.',
        supplierId: suppliers[4].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Perfume Dolce & Gabbana Light Blue',
        brand: 'D&G',
        category: Category.PERFUMERIA,
        price: 520,
        purchasePrice: 300,
        stock: 10,
        minStock: 3,
        barcode: '8011003829125',
        description: 'Fragancia cítrica y fresca. Manzana, limón, cedro. 100ml.',
        supplierId: suppliers[4].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Perfume Versace Eros',
        brand: 'Versace',
        category: Category.PERFUMERIA,
        price: 480,
        purchasePrice: 270,
        stock: 7,
        minStock: 2,
        barcode: '8011003837519',
        description: 'Fragancia aromática para hombre. Menta, manzana verde, haba tonka. 100ml.',
        supplierId: suppliers[4].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Perfume Armani Si Intense',
        brand: 'Giorgio Armani',
        category: Category.PERFUMERIA,
        price: 620,
        purchasePrice: 360,
        stock: 6,
        minStock: 2,
        barcode: '3614272849254',
        description: 'Fragancia oriental femenina. Rosa, vainilla, patchouli. 100ml.',
        supplierId: suppliers[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Agua de Toilette Natura Kaiak',
        brand: 'Natura',
        category: Category.PERFUMERIA,
        price: 180,
        purchasePrice: 95,
        stock: 20,
        minStock: 5,
        barcode: '7891234560001',
        description: 'Fragancia acuática masculina. Notas marinas, cítricos, almizcle. 100ml.',
        supplierId: suppliers[3].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Perfume Oud Satin Mood',
        brand: 'Maison Francis Kurkdjian',
        category: Category.PERFUMERIA,
        price: 1200,
        purchasePrice: 700,
        stock: 4,
        minStock: 1,
        barcode: '3760164160018',
        description: 'Oud, rosa, vainilla. Fragancia oriental intensa. 70ml.',
        supplierId: suppliers[0].id,
      },
    }),

    // CUIDADO PERSONAL
    prisma.product.create({
      data: {
        name: 'Crema Hidratante Nivea',
        brand: 'Nivea',
        category: Category.CUIDADO_PERSONAL,
        price: 45,
        purchasePrice: 22,
        stock: 50,
        minStock: 10,
        barcode: '4005808898201',
        description: 'Hidratación profunda para piel normal. 400ml.',
        supplierId: suppliers[2].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Protector Solar FPS 50',
        brand: 'La Roche-Posay',
        category: Category.CUIDADO_PERSONAL,
        price: 120,
        purchasePrice: 65,
        stock: 25,
        minStock: 5,
        barcode: '3337875530012',
        description: 'Protección solar facial. Textura ligera, no grasa. 50ml.',
        supplierId: suppliers[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Shampoo Anticaspa Head & Shoulders',
        brand: 'Head & Shoulders',
        category: Category.CUIDADO_PERSONAL,
        price: 35,
        purchasePrice: 18,
        stock: 40,
        minStock: 8,
        barcode: '8001090736531',
        description: 'Elimina la caspa y previene su reaparición. 400ml.',
        supplierId: suppliers[2].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Desodorante Rexona Men',
        brand: 'Rexona',
        category: Category.CUIDADO_PERSONAL,
        price: 28,
        purchasePrice: 14,
        stock: 60,
        minStock: 15,
        barcode: '7791293000123',
        description: 'Protección 48h. Spray antitranspirante. 150ml.',
        supplierId: suppliers[2].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Crema para Manos Neutrogena',
        brand: 'Neutrogena',
        category: Category.CUIDADO_PERSONAL,
        price: 55,
        purchasePrice: 28,
        stock: 30,
        minStock: 5,
        barcode: '3008716200108',
        description: 'Fórmula noruega. Reparación intensiva de manos secas. 50ml.',
        supplierId: suppliers[1].id,
      },
    }),

    // COSMÉTICOS
    prisma.product.create({
      data: {
        name: 'Base de Maquillaje Maybelline Fit Me',
        brand: 'Maybelline',
        category: Category.COSMETICOS,
        price: 85,
        purchasePrice: 42,
        stock: 35,
        minStock: 8,
        barcode: '3600541753001',
        description: 'Base líquida matte. Cobertura media. Tonos variados. 30ml.',
        supplierId: suppliers[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Máscara de Pestañas L\'Oréal Lash Paradise',
        brand: 'L\'Oréal',
        category: Category.COSMETICOS,
        price: 95,
        purchasePrice: 48,
        stock: 20,
        minStock: 5,
        barcode: '3600541852601',
        description: 'Volumen extremo y efecto sedoso. 7.6ml.',
        supplierId: suppliers[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Paleta de Sombras Urban Decay Naked',
        brand: 'Urban Decay',
        category: Category.COSMETICOS,
        price: 350,
        purchasePrice: 190,
        stock: 10,
        minStock: 2,
        barcode: '6040790483291',
        description: '12 tonos neutros mate y shimmer. Alta pigmentación.',
        supplierId: suppliers[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Labial Liquido Matte NYX',
        brand: 'NYX',
        category: Category.COSMETICOS,
        price: 65,
        purchasePrice: 30,
        stock: 40,
        minStock: 10,
        barcode: '800897101106',
        description: 'Labial líquido mate de larga duración. Sin transferencia.',
        supplierId: suppliers[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Polvo Compacto REVLON ColorStay',
        brand: 'Revlon',
        category: Category.COSMETICOS,
        price: 75,
        purchasePrice: 38,
        stock: 18,
        minStock: 4,
        barcode: '309978021003',
        description: 'Cobertura completa, acabado natural. Incluye espejo. 12g.',
        supplierId: suppliers[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Corrector de Ojos Maybelline Instant Age Rewind',
        brand: 'Maybelline',
        category: Category.COSMETICOS,
        price: 70,
        purchasePrice: 35,
        stock: 22,
        minStock: 5,
        barcode: '3600541267603',
        description: 'Corrige ojeras y líneas de expresión. Aplicador esponja. 6ml.',
        supplierId: suppliers[1].id,
      },
    }),

    // ACCESORIOS
    prisma.product.create({
      data: {
        name: 'Brocha para Polvo Sigma Beauty',
        brand: 'Sigma',
        category: Category.OTRO,
        price: 120,
        purchasePrice: 55,
        stock: 15,
        minStock: 3,
        barcode: '817435015001',
        description: 'Brocha profesional para aplicación de polvo y rubor.',
        supplierId: suppliers[2].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Esponja de Maquillaje Beauty Blender',
        brand: 'Beauty Blender',
        category: Category.OTRO,
        price: 80,
        purchasePrice: 35,
        stock: 25,
        minStock: 5,
        barcode: '817435020001',
        description: 'Esponja latex-free para base y corrector. Forma de huevo.',
        supplierId: suppliers[2].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Neceser de Cuero Sintético',
        brand: 'Genérico',
        category: Category.OTRO,
        price: 45,
        purchasePrice: 18,
        stock: 30,
        minStock: 5,
        barcode: null,
        description: 'Neceser resistente al agua. Tamaño medio. Varios colores.',
        supplierId: suppliers[2].id,
      },
    }),
  ]);
  console.log(`✅ ${products.length} productos creados`);

  // ── Clientes ─────────────────────────────────────────────
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'María Elena',
        lastName: 'Vargas Montaño',
        email: 'maria.vargas@gmail.com',
        phone: '70111222',
        documentId: '5512345',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Carla',
        lastName: 'Hinojosa Pérez',
        email: 'carla.hinojosa@hotmail.com',
        phone: '70222333',
        documentId: '6234567',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Andrea',
        lastName: 'Cáceres López',
        email: 'andrea.caceres@gmail.com',
        phone: '70333444',
        documentId: '7345678',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Lucía',
        lastName: 'Torres Rivero',
        email: null,
        phone: '70444555',
        documentId: '8456789',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Gabriela',
        lastName: 'Mendoza Villca',
        email: 'gaby.mendoza@yahoo.com',
        phone: '70555666',
        documentId: '9567890',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Patricia',
        lastName: 'Rojas Quispe',
        email: null,
        phone: '70666777',
        documentId: '4123456',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Fernando',
        lastName: 'Gutiérrez Álvarez',
        email: 'fernando.gutierrez@gmail.com',
        phone: '70777888',
        documentId: '5234567',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Sofía',
        lastName: 'Aguilar Mamani',
        email: 'sofia.aguilar@outlook.com',
        phone: '70888999',
        documentId: '6345678',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Roberto',
        lastName: 'Callisaya Escobar',
        email: null,
        phone: '70999000',
        documentId: '7456789',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Valentina',
        lastName: 'Mendoza Flores',
        email: 'vale.mendoza@gmail.com',
        phone: '70100100',
        documentId: '8567890',
      },
    }),
  ]);
  console.log(`✅ ${customers.length} clientes creados`);

  // ── Usuarios (Staff) ─────────────────────────────────────
  const users = await Promise.all([
    prisma.staffUser.create({
      data: {
        name: 'Admin',
        lastName: 'Camila',
        email: 'admin@comercialcamila.com',
        password: 'admin123',
        role: Role.admin,
        phone: '70000001',
      },
    }),
    prisma.staffUser.create({
      data: {
        name: 'Daniela',
        lastName: 'Rojas',
        email: 'daniela@comercialcamila.com',
        password: 'vendedora123',
        role: Role.vendedora,
        phone: '70000002',
      },
    }),
    prisma.staffUser.create({
      data: {
        name: 'Carolina',
        lastName: 'Méndez',
        email: 'carolina@comercialcamila.com',
        password: 'vendedora123',
        role: Role.vendedora,
        phone: '70000003',
      },
    }),
    prisma.staffUser.create({
      data: {
        name: 'Luis',
        lastName: 'Gómez',
        email: 'luis@comercialcamila.com',
        password: 'inventarista123',
        role: Role.inventarista,
        phone: '70000004',
      },
    }),
  ]);
  console.log(`✅ ${users.length} usuarios creados`);

  // ── Ventas de ejemplo ────────────────────────────────────
  const salesData = [
    { customerIdx: 0, userIdx: 1, productIdxs: [0, 8], discount: 0, payment: PaymentMethod.efectivo },
    { customerIdx: 1, userIdx: 1, productIdxs: [2, 13], discount: 20, payment: PaymentMethod.qr },
    { customerIdx: 2, userIdx: 2, productIdxs: [6, 9, 10], discount: 0, payment: PaymentMethod.efectivo },
    { customerIdx: 3, userIdx: 1, productIdxs: [1], discount: 50, payment: PaymentMethod.card },
    { customerIdx: 4, userIdx: 2, productIdxs: [4, 15], discount: 0, payment: PaymentMethod.transfer },
    { customerIdx: 5, userIdx: 1, productIdxs: [12, 13, 14], discount: 15, payment: PaymentMethod.efectivo },
    { customerIdx: 6, userIdx: 2, productIdxs: [3, 7], discount: 0, payment: PaymentMethod.qr },
    { customerIdx: 7, userIdx: 1, productIdxs: [11, 16], discount: 0, payment: PaymentMethod.efectivo },
    { customerIdx: 8, userIdx: 2, productIdxs: [5, 17], discount: 30, payment: PaymentMethod.card },
    { customerIdx: 9, userIdx: 1, productIdxs: [18, 19, 20], discount: 0, payment: PaymentMethod.efectivo },
  ];

  const createdSales = [];
  for (const s of salesData) {
    const saleProducts = s.productIdxs.map((idx) => products[idx]);
    const subtotal = saleProducts.reduce((sum, p) => sum + p.price, 0);
    const total = subtotal - s.discount;

    const sale = await prisma.sale.create({
      data: {
        customerName: `${customers[s.customerIdx].name} ${customers[s.customerIdx].lastName}`,
        customerId: customers[s.customerIdx].id,
        userId: users[s.userIdx].id,
        subtotal,
        total,
        discount: s.discount,
        paymentMethod: s.payment,
        items: {
          create: saleProducts.map((p) => ({
            productId: p.id,
            name: p.name,
            price: p.price,
            quantity: 1,
            discount: 0,
          })),
        },
      },
    });
    createdSales.push(sale);
  }
  console.log(`✅ ${createdSales.length} ventas creadas`);

  console.log('\n🎉 ¡Siembra completada!');
  console.log(`   📦 ${suppliers.length} proveedores`);
  console.log(`   🛍️  ${products.length} productos`);
  console.log(`   👥 ${customers.length} clientes`);
  console.log(`   👤 ${users.length} usuarios`);
  console.log(`   🧾 ${createdSales.length} ventas`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante la siembra:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
