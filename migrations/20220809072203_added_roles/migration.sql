-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('SUPER_ADMIN', 'RECRUITER_ADMIN', 'TEAM_LEAD', 'INTERVIEWER', 'RESUME_SCREENER', 'TELEPHONE_SCREENER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('INVITED', 'JOINED', 'DEACTIVATED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "companyName" TEXT,
    "aboutCompany" TEXT,
    "role" "RoleType" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT E'INVITED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");
