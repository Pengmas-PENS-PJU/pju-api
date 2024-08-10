/*
  Warnings:

  - You are about to drop the column `brightsness` on the `LampLog` table. All the data in the column will be lost.
  - Added the required column `brightness` to the `LampLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LampLog" DROP COLUMN "brightsness",
ADD COLUMN     "brightness" INTEGER NOT NULL;
