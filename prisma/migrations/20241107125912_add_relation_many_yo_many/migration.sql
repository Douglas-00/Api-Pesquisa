/*
  Warnings:

  - You are about to drop the column `responseDate` on the `SearchResponse` table. All the data in the column will be lost.
  - You are about to drop the column `responseText` on the `SearchResponse` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SearchResponse" DROP COLUMN "responseDate",
DROP COLUMN "responseText",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "QuestionResponse" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "responseId" INTEGER NOT NULL,
    "answer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "QuestionResponse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuestionResponse" ADD CONSTRAINT "QuestionResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "SearchQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionResponse" ADD CONSTRAINT "QuestionResponse_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "SearchResponse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
