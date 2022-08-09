/*
  Warnings:

  - The values [USER,ADMIN] on the enum `RoleType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('INVITED', 'JOINED', 'DEACTIVATED');

-- AlterEnum
BEGIN;
CREATE TYPE "RoleType_new" AS ENUM ('SUPER_ADMIN', 'RECRUITER_ADMIN', 'TEAM_LEAD', 'INTERVIEWER', 'RESUME_SCREENER', 'TELEPHONE_SCREENER');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "RoleType_new" USING ("role"::text::"RoleType_new");
ALTER TYPE "RoleType" RENAME TO "RoleType_old";
ALTER TYPE "RoleType_new" RENAME TO "RoleType";
DROP TYPE "RoleType_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT E'INVITED',
ALTER COLUMN "role" DROP DEFAULT;
