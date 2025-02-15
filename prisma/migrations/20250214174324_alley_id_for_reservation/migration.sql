/*
  Warnings:

  - The values [AVAILABLE] on the enum `ReservationStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `alleyId` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReservationStatus_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
ALTER TABLE "Reservation" ALTER COLUMN "reservationStatus" DROP DEFAULT;
ALTER TABLE "Reservation" ALTER COLUMN "reservationStatus" TYPE "ReservationStatus_new" USING ("reservationStatus"::text::"ReservationStatus_new");
ALTER TYPE "ReservationStatus" RENAME TO "ReservationStatus_old";
ALTER TYPE "ReservationStatus_new" RENAME TO "ReservationStatus";
DROP TYPE "ReservationStatus_old";
ALTER TABLE "Reservation" ALTER COLUMN "reservationStatus" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "alleyId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_alleyId_fkey" FOREIGN KEY ("alleyId") REFERENCES "BowlingAlley"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
