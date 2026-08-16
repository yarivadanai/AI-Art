-- Phase 2: adaptive (staircase) sessions.
ALTER TABLE "Session" ADD COLUMN "mode" TEXT NOT NULL DEFAULT 'fixed';
ALTER TABLE "Session" ADD COLUMN "state" JSONB;
