-- AlterTable
ALTER TABLE "cash_sessions" ADD COLUMN     "expectedCashManual" DOUBLE PRECISION,
ADD COLUMN     "expectedQrManual" DOUBLE PRECISION,
ADD COLUMN     "leftInCash" DOUBLE PRECISION,
ADD COLUMN     "qrCounted" DOUBLE PRECISION;
