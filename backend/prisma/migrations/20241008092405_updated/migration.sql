/*
  Warnings:

  - A unique constraint covering the columns `[organizationDomain]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_organizationDomain_key" ON "User"("organizationDomain");
