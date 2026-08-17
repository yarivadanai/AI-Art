-- Phase 3: machine cohorts carry a label (model id / solver name) for the dashboard.
ALTER TABLE "Session" ADD COLUMN "label" TEXT;
