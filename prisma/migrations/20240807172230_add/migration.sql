-- AlterTable
ALTER TABLE "Authenticator" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "profile" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;
