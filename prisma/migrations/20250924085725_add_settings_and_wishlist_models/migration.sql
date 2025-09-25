-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '1',
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Wishlist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerId" TEXT,
    "productId" TEXT,
    "productTitle" TEXT,
    "shop" TEXT,
    "productImage" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" REAL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP
);
