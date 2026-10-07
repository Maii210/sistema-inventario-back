-- AlterTable
ALTER TABLE "sale_items" ADD COLUMN     "externalCost" DOUBLE PRECISION,
ADD COLUMN     "isExternal" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "settings" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "cash_sessions" (
    "id" TEXT NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "openingAmount" DOUBLE PRECISION NOT NULL,
    "openedById" TEXT,
    "openedByName" TEXT,
    "closedAt" TIMESTAMP(3),
    "countedAmount" DOUBLE PRECISION,
    "closedById" TEXT,
    "closedByName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "notes" TEXT,

    CONSTRAINT "cash_sessions_pkey" PRIMARY KEY ("id")
);
