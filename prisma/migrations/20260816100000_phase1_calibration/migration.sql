-- Phase 1: calibration, abstention, intake beliefs, stored metrics.

-- Session: intake beliefs + cohort
ALTER TABLE "Session" ADD COLUMN "beliefs" JSONB;
ALTER TABLE "Session" ADD COLUMN "cohort" TEXT NOT NULL DEFAULT 'human';

-- Response: confidence + abstained
ALTER TABLE "Response" ADD COLUMN "confidence" TEXT;
ALTER TABLE "Response" ADD COLUMN "abstained" BOOLEAN NOT NULL DEFAULT false;

-- Result: stored metrics
ALTER TABLE "Result" ADD COLUMN "metrics" JSONB;

-- Responses become one-per-(session, question). Remove any duplicates that a
-- pre-Phase-1 double submit may have created (keep the earliest row by id),
-- then enforce uniqueness.
DELETE FROM "Response" r
USING "Response" r2
WHERE r."sessionId" = r2."sessionId"
  AND r."questionId" = r2."questionId"
  AND r.id > r2.id;

CREATE UNIQUE INDEX "Response_sessionId_questionId_key" ON "Response"("sessionId", "questionId");

-- Drop a column the schema removed before this migration existed (unused since the SCCA rewrite).
ALTER TABLE "Session" DROP COLUMN IF EXISTS "includesCoding";
