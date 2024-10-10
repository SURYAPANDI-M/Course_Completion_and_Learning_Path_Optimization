-- DropIndex
DROP INDEX "User_organizationDomain_key";

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "learningPathId" INTEGER;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "LearningPath"("id") ON DELETE SET NULL ON UPDATE CASCADE;
