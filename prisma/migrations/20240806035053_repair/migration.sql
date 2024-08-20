/*
  Warnings:

  - You are about to drop the column `saltPassword` on the `Authenticator` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Authenticator` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `saltKey` to the `Authenticator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Authenticator" DROP COLUMN "saltPassword",
ADD COLUMN     "saltKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Authenticator_email_key" ON "Authenticator"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
