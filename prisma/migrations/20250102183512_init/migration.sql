-- CreateTable
CREATE TABLE "Resolution" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "character" INTEGER NOT NULL,
    "objectives" TEXT[],
    "atlasWish" TEXT NOT NULL,

    CONSTRAINT "Resolution_pkey" PRIMARY KEY ("id")
);
