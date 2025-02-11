/*
  Warnings:

  - You are about to drop the column `fullName` on the `Account` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "fullName",
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Account_username_key" ON "Account"("username");
