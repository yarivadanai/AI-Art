import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SessionService } from '../session/session.service.js';

export type TelemetryEventType = 'paste' | 'focus' | 'blur' | 'visibility';

export interface TelemetryRecord {
  specimenId: string;
  event: TelemetryEventType;
  at: string;
  payload?: Record<string, unknown>;
}

const SUSPICION_WEIGHTS: Record<TelemetryEventType, number> = {
  paste: 0.35,
  blur: 0.2,
  focus: 0,
  visibility: 0.15,
};

@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);
  private readonly memoryStore: TelemetryRecord[] = [];

  constructor(
    private readonly prisma: PrismaService,
    private readonly sessions: SessionService,
  ) {}

  async record(event: TelemetryRecord): Promise<void> {
    if (this.prisma.isEnabled) {
      await this.prisma.prisma.telemetryEvent.create({
        data: {
          sessionId: event.specimenId,
          event: event.event,
          payload: event.payload,
          createdAt: new Date(event.at),
        },
      });
    } else {
      this.memoryStore.push(event);
    }

    const delta = SUSPICION_WEIGHTS[event.event] ?? 0;
    if (delta > 0) {
      await this.sessions.adjustSuspicion(event.specimenId, delta);
    }
  }

  async recent(limit = 10): Promise<TelemetryRecord[]> {
    if (this.prisma.isEnabled) {
      const rows = await this.prisma.prisma.telemetryEvent.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
      return rows.map((row: PrismaTelemetryRow) => {
        return {
          specimenId: row.sessionId,
          event: row.event as TelemetryEventType,
          at: row.createdAt.toISOString(),
          payload: row.payload as Record<string, unknown> | undefined,
        } satisfies TelemetryRecord;
      });
    }

    return [...this.memoryStore].slice(-limit).reverse();
  }
}

interface PrismaTelemetryRow {
  sessionId: string;
  event: string;
  payload: unknown;
  createdAt: Date;
}
