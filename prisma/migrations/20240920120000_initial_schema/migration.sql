-- Prisma Migration: initial schema for HIT-ARC
-- Generated manually to establish baseline tables for Postgres deployments

CREATE TABLE "Session" (
  "id" TEXT PRIMARY KEY,
  "seed" TEXT NOT NULL,
  "startedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "consent" BOOLEAN NOT NULL DEFAULT FALSE,
  "demographics" JSONB,
  "suspicion" DOUBLE PRECISION NOT NULL DEFAULT 0
);

CREATE TABLE "Item" (
  "id" TEXT PRIMARY KEY,
  "sessionId" TEXT NOT NULL,
  "section" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "answerKey" JSONB NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT "Item_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE
);

CREATE INDEX "Item_sessionId_idx" ON "Item" ("sessionId");

CREATE TABLE "Response" (
  "id" TEXT PRIMARY KEY,
  "itemId" TEXT,
  "sessionId" TEXT NOT NULL,
  "submittedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "rawAnswer" JSONB NOT NULL,
  "correct" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timeMs" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION,
  "suspicion" DOUBLE PRECISION NOT NULL DEFAULT 0,
  CONSTRAINT "Response_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL,
  CONSTRAINT "Response_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE
);

CREATE INDEX "Response_sessionId_idx" ON "Response" ("sessionId");
CREATE INDEX "Response_itemId_idx" ON "Response" ("itemId");

CREATE TABLE "Result" (
  "id" TEXT PRIMARY KEY,
  "sessionId" TEXT NOT NULL UNIQUE,
  "sectionScores" JSONB NOT NULL,
  "calibration" JSONB,
  "overall" DOUBLE PRECISION NOT NULL,
  "verdict" TEXT,
  "errorProfile" JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT "Result_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE
);

CREATE TABLE "LeaderboardOptIn" (
  "id" TEXT PRIMARY KEY,
  "sessionId" TEXT NOT NULL UNIQUE,
  "handle" TEXT NOT NULL,
  CONSTRAINT "LeaderboardOptIn_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE
);

-- Telemetry events will be added in a later migration when suspicion scoring is implemented.
