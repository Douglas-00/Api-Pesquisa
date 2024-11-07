/*
  Warnings:

  - The primary key for the `Search` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Search` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `SearchQuestion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `SearchQuestion` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `SearchResponse` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `SearchResponse` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `searchId` on the `SearchQuestion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `searchId` on the `SearchResponse` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "SearchQuestion" DROP CONSTRAINT "SearchQuestion_searchId_fkey";

-- DropForeignKey
ALTER TABLE "SearchResponse" DROP CONSTRAINT "SearchResponse_searchId_fkey";

-- AlterTable
ALTER TABLE "Search" DROP CONSTRAINT "Search_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Search_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SearchQuestion" DROP CONSTRAINT "SearchQuestion_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "searchId",
ADD COLUMN     "searchId" INTEGER NOT NULL,
ADD CONSTRAINT "SearchQuestion_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SearchResponse" DROP CONSTRAINT "SearchResponse_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "searchId",
ADD COLUMN     "searchId" INTEGER NOT NULL,
ADD CONSTRAINT "SearchResponse_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "SearchQuestion" ADD CONSTRAINT "SearchQuestion_searchId_fkey" FOREIGN KEY ("searchId") REFERENCES "Search"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchResponse" ADD CONSTRAINT "SearchResponse_searchId_fkey" FOREIGN KEY ("searchId") REFERENCES "Search"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
