/*
  Warnings:

  - Added the required column `organizationDomain` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationDomain` to the `LearningPath` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "organizationDomain" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LearningPath" ADD COLUMN     "organizationDomain" TEXT NOT NULL;
