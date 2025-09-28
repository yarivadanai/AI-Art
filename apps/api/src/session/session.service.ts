import { Injectable } from '@nestjs/common';
import { createSeededRng } from '@hit-arc/engine';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSessionDto } from './session.dto.js';
import { SessionTokenService } from './session-token.service.js';
import { generateSessionSeed } from './session-seed.js';

export interface SessionRecord {
  specimenId: string;
  seed: string;
  expiresAt: string;
  consent?: boolean;
  demographics?: Record<string, unknown> | null;
  suspicion: number;
}

export interface SessionCreationResult extends SessionRecord {
  token: string;
}

@Injectable()
export class SessionService {
  private readonly sessions = new Map<string, SessionRecord>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly tokens: SessionTokenService,
  ) {}

  async create(dto: CreateSessionDto): Promise<SessionCreationResult> {
    const seed = generateSessionSeed();
    const specimenId = dto.specimenAlias ?? `spec-${seed}`;
    const rng = createSeededRng(seed);
    rng.float();
    const expiresAtDate = new Date(Date.now() + 20 * 60 * 1000);
    const expiresAtIso = expiresAtDate.toISOString();
    const consentFlag = dto.consent ?? false;
    const demographics = dto.demographics ?? null;
    const record: SessionRecord = {
      specimenId,
      seed,
      expiresAt: expiresAtIso,
      consent: consentFlag,
      demographics,
      suspicion: 0,
    };

    const token = this.tokens.sign({ specimenId, seed, expiresAt: expiresAtDate });

    if (this.prisma.isEnabled) {
      const client = this.prisma.prisma;
      await client.session.upsert({
        where: { id: specimenId },
        create: {
          id: specimenId,
          seed,
          expiresAt: expiresAtDate,
          consent: consentFlag,
          demographics,
          suspicion: 0,
        },
        update: {
          seed,
          expiresAt: expiresAtDate,
          ...(dto.consent !== undefined ? { consent: consentFlag } : {}),
          ...(dto.demographics !== undefined ? { demographics } : {}),
          suspicion: 0,
        },
      });
      return {
        ...record,
        token,
      } satisfies SessionCreationResult;
    }

    this.sessions.set(specimenId, record);
    return {
      ...record,
      token,
    } satisfies SessionCreationResult;
  }

  async recordConsent(dto: CreateSessionDto): Promise<void> {
    if (!dto.specimenAlias) {
      return;
    }

    if (this.prisma.isEnabled) {
      const client = this.prisma.prisma;
      await client.session.upsert({
        where: { id: dto.specimenAlias },
        create: {
          id: dto.specimenAlias,
          seed: dto.specimenAlias,
          expiresAt: new Date(Date.now() + 20 * 60 * 1000),
          consent: true,
          demographics: dto.demographics ?? null,
          suspicion: 0,
        },
        update: {
          consent: true,
          ...(dto.demographics !== undefined ? { demographics: dto.demographics ?? null } : {}),
        },
      });
      return;
    }

    if (!this.sessions.has(dto.specimenAlias)) {
      this.sessions.set(dto.specimenAlias, {
        specimenId: dto.specimenAlias,
        seed: dto.specimenAlias,
        expiresAt: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
        consent: true,
        demographics: dto.demographics ?? null,
        suspicion: 0,
      });
    } else {
      const existing = this.sessions.get(dto.specimenAlias);
      if (existing) {
        this.sessions.set(dto.specimenAlias, {
          ...existing,
          consent: true,
          demographics: dto.demographics ?? existing.demographics ?? null,
        });
      }
    }
  }

  async get(specimenId: string): Promise<SessionRecord | undefined> {
    if (this.prisma.isEnabled) {
      const client = this.prisma.prisma;
      const record = await client.session.findUnique({ where: { id: specimenId } });
      if (!record) {
        return undefined;
      }
      return {
        specimenId: record.id,
        seed: record.seed,
        expiresAt: record.expiresAt.toISOString(),
        consent: record.consent ?? undefined,
        demographics: (record.demographics as Record<string, unknown> | null) ?? null,
        suspicion: record.suspicion ?? 0,
      } satisfies SessionRecord;
    }

    return this.sessions.get(specimenId);
  }

  async adjustSuspicion(specimenId: string, delta: number): Promise<void> {
    if (this.prisma.isEnabled) {
      const client = this.prisma.prisma;
      await client.session.update({
        where: { id: specimenId },
        data: {
          suspicion: { increment: delta },
        },
      });
      return;
    }

    const existing = this.sessions.get(specimenId);
    if (existing) {
      this.sessions.set(specimenId, {
        ...existing,
        suspicion: (existing.suspicion ?? 0) + delta,
      });
    }
  }

  async list(): Promise<SessionRecord[]> {
    if (this.prisma.isEnabled) {
      const rows = await this.prisma.prisma.session.findMany();
      return rows.map((row: PrismaSessionRow) => {
        return {
          specimenId: row.id,
          seed: row.seed,
          expiresAt: row.expiresAt.toISOString(),
          consent: row.consent ?? undefined,
          demographics: (row.demographics as Record<string, unknown> | null) ?? null,
          suspicion: row.suspicion ?? 0,
        } satisfies SessionRecord;
      });
    }

    return Array.from(this.sessions.values()).map((record) => ({ ...record }));
  }

  async count(): Promise<number> {
    if (this.prisma.isEnabled) {
      return this.prisma.prisma.session.count();
    }

    return this.sessions.size;
  }
}

interface PrismaSessionRow {
  id: string;
  seed: string;
  expiresAt: Date;
  consent: boolean | null;
  demographics: unknown;
  suspicion: number | null;
}
