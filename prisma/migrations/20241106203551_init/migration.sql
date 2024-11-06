-- CreateTable
CREATE TABLE "Search" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Search_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchQuestion" (
    "id" TEXT NOT NULL,
    "searchId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SearchQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchResponse" (
    "id" TEXT NOT NULL,
    "searchId" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "responseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SearchResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Search_title_targetAudience_key" ON "Search"("title", "targetAudience");

-- AddForeignKey
ALTER TABLE "SearchQuestion" ADD CONSTRAINT "SearchQuestion_searchId_fkey" FOREIGN KEY ("searchId") REFERENCES "Search"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchResponse" ADD CONSTRAINT "SearchResponse_searchId_fkey" FOREIGN KEY ("searchId") REFERENCES "Search"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
