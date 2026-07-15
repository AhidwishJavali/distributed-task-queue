/*
  Warnings:

  - Added the required column `image` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Job" ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "processingStage" TEXT NOT NULL DEFAULT 'Queued',
ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "workerName" TEXT;
