-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT,
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "searchableName" TEXT NOT NULL DEFAULT '';
