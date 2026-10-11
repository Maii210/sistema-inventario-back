-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'superadmin';

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "address" TEXT,
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "staff_users" ADD COLUMN     "documentId" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "suppliers" ADD COLUMN     "address" TEXT;
