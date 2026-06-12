-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_technicianId_fkey";

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "technicians"("id") ON DELETE SET NULL ON UPDATE CASCADE;
