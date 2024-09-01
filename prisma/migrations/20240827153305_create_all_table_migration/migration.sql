/*
  Warnings:

  - Added the required column `automated` to the `LampLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LampLog" ADD COLUMN     "automated" BOOLEAN NOT NULL;
