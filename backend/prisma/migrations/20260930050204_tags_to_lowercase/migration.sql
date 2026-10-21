/*
  Warnings:

  - The values [NEW,BESTSELLER,DEAL] on the enum `ProductTag` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProductTag_new" AS ENUM ('new', 'bestseller', 'deal');
ALTER TABLE "products" ALTER COLUMN "tags" TYPE "ProductTag_new"[] USING ("tags"::text::"ProductTag_new"[]);
ALTER TYPE "ProductTag" RENAME TO "ProductTag_old";
ALTER TYPE "ProductTag_new" RENAME TO "ProductTag";
DROP TYPE "public"."ProductTag_old";
COMMIT;
