/*
  Warnings:

  - A unique constraint covering the columns `[challengeId,userId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_challengeId_userId_key" ON "Post"("challengeId", "userId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
