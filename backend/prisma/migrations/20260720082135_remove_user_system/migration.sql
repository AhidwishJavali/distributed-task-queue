/*
  Warnings:

  - You are about to drop the column `userId` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Job" DROP CONSTRAINT "Job_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Job" DROP COLUMN "userId";

-- DropTable
DROP TABLE "public"."User";

-- DropEnum
DROP TYPE "public"."UserRole";
