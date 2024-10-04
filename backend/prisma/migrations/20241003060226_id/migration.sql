/*
  Warnings:

  - Added the required column `lastUpdated` to the `Enrollment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `percentage` to the `Enrollment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "lastUpdated" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "percentage" INTEGER NOT NULL;
