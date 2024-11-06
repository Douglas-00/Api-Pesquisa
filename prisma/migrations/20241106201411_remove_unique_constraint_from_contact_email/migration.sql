/*
  Warnings:

  - A unique constraint covering the columns `[title,targetAudience]` on the table `Search` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "SearchResponse_contactEmail_key";

-- CreateIndex
CREATE UNIQUE INDEX "Search_title_targetAudience_key" ON "Search"("title", "targetAudience");
