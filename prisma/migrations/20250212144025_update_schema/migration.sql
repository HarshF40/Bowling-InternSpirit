/*
  Warnings:

  - The `status` column on the `TimeSlot` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TimeSlotStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- AlterTable
ALTER TABLE "TimeSlot" ALTER COLUMN "startTime" SET DATA TYPE TEXT,
ALTER COLUMN "endTime" SET DATA TYPE TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "TimeSlotStatus" NOT NULL DEFAULT 'AVAILABLE';
