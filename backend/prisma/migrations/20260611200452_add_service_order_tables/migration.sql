/*
  Warnings:

  - You are about to drop the column `description` on the `service_orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "service_orders" DROP COLUMN "description",
ADD COLUMN     "observations" TEXT,
ADD COLUMN     "quoteId" TEXT,
ADD COLUMN     "scheduledAt" TIMESTAMP(3),
ADD COLUMN     "signature" TEXT;

-- CreateTable
CREATE TABLE "service_order_services" (
    "id" TEXT NOT NULL,
    "serviceOrderId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "service_order_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_order_materials" (
    "id" TEXT NOT NULL,
    "serviceOrderId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "unitValue" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "service_order_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_order_photos" (
    "id" TEXT NOT NULL,
    "serviceOrderId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_order_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_order_checklist_items" (
    "id" TEXT NOT NULL,
    "serviceOrderId" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "checked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "service_order_checklist_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "service_orders" ADD CONSTRAINT "service_orders_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_order_services" ADD CONSTRAINT "service_order_services_serviceOrderId_fkey" FOREIGN KEY ("serviceOrderId") REFERENCES "service_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_order_materials" ADD CONSTRAINT "service_order_materials_serviceOrderId_fkey" FOREIGN KEY ("serviceOrderId") REFERENCES "service_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_order_photos" ADD CONSTRAINT "service_order_photos_serviceOrderId_fkey" FOREIGN KEY ("serviceOrderId") REFERENCES "service_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_order_checklist_items" ADD CONSTRAINT "service_order_checklist_items_serviceOrderId_fkey" FOREIGN KEY ("serviceOrderId") REFERENCES "service_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
