/*
  Warnings:

  - A unique constraint covering the columns `[access_token]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[refresh_token]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_access_token_key" ON "RefreshToken"("access_token");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_refresh_token_key" ON "RefreshToken"("refresh_token");

-- CreateIndex
CREATE INDEX "RefreshToken_access_token_idx" ON "RefreshToken" USING HASH ("access_token");

-- CreateIndex
CREATE INDEX "RefreshToken_refresh_token_idx" ON "RefreshToken" USING HASH ("refresh_token");
