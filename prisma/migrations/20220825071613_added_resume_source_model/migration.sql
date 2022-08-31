-- CreateTable
CREATE TABLE "ResumeSource" (
    "id" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ResumeSource_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ResumeSource" ADD CONSTRAINT "ResumeSource_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
