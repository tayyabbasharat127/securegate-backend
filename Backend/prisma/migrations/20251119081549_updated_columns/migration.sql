/*
  Warnings:

  - You are about to drop the column `location` on the `LoginEvent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[loginEventId]` on the table `RiskScore` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuditLog" ALTER COLUMN "action" SET DEFAULT 'UNKNOWN';

-- AlterTable
ALTER TABLE "LoginEvent" DROP COLUMN "location",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ALTER COLUMN "status" SET DEFAULT 'SUCCESS';

-- AlterTable
ALTER TABLE "SecurityAction" ALTER COLUMN "actionType" SET DEFAULT 'NONE';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "username" TEXT;

-- CreateIndex
CREATE INDEX "LoginEvent_userId_idx" ON "LoginEvent"("userId");

-- CreateIndex
CREATE INDEX "LoginEvent_loginTime_idx" ON "LoginEvent"("loginTime");

-- CreateIndex
CREATE INDEX "LoginEvent_ipAddress_idx" ON "LoginEvent"("ipAddress");

-- CreateIndex
CREATE UNIQUE INDEX "RiskScore_loginEventId_key" ON "RiskScore"("loginEventId");
