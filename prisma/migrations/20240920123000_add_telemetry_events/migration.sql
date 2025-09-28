-- Prisma Migration: telemetry events table and session relation

CREATE TABLE "TelemetryEvent" (
  "id" TEXT PRIMARY KEY,
  "sessionId" TEXT NOT NULL,
  "event" TEXT NOT NULL,
  "payload" JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT "TelemetryEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE
);

CREATE INDEX "TelemetryEvent_sessionId_idx" ON "TelemetryEvent" ("sessionId");
