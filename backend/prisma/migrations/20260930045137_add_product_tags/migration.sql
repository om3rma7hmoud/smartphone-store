-- CreateEnum
CREATE TYPE "ProductTag" AS ENUM ('NEW', 'BESTSELLER', 'DEAL');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "display" TEXT,
ADD COLUMN     "tags" "ProductTag"[];
