import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export interface SectionResultRecord {
  code: string;
  label: string;
  score: number;
  details: unknown;
}

export interface ResultRecord {
  specimenId: string;
  completedAt: string;
  sections: SectionResultRecord[];
  overall?: number;
  verdict?: string;
}

@Injectable()
export class ResultsService {
  private readonly fallback = new Map<string, ResultRecord>();

  constructor(private readonly prisma: PrismaService) {}

  async saveSection(specimenId: string, section: SectionResultRecord): Promise<ResultRecord> {
    if (this.prisma.isEnabled) {
      const client = this.prisma.prisma;
      const existing = await client.result.findUnique({ where: { sessionId: specimenId } });
      const sections: SectionResultRecord[] = existing
        ? ((existing.sectionScores as SectionResultRecord[]) ?? [])
        : [];
      const filtered = sections.filter((entry) => entry.code !== section.code);
      const next = [...filtered, section];

      const overall = averageScore(next);
      const verdict = inferVerdict(overall);

      const record = await client.result.upsert({
        where: { sessionId: specimenId },
        create: {
          sessionId: specimenId,
          sectionScores: next,
          overall,
          verdict,
        },
        update: {
          sectionScores: next,
          overall,
          verdict,
        },
      });

      return {
        specimenId,
        completedAt: record.createdAt.toISOString(),
        sections: next,
        overall,
        verdict,
      } satisfies ResultRecord;
    }

    const existing = this.fallback.get(specimenId);
    const filtered = existing?.sections.filter((entry) => entry.code !== section.code) ?? [];
    const sections = [...filtered, section];
    const overall = averageScore(sections);
    const verdict = inferVerdict(overall);
    const record: ResultRecord = {
      specimenId,
      completedAt: new Date().toISOString(),
      sections,
      overall,
      verdict,
    };
    this.fallback.set(specimenId, record);
    return record;
  }

  async find(specimenId: string): Promise<ResultRecord | undefined> {
    if (this.prisma.isEnabled) {
      const client = this.prisma.prisma;
      const record = await client.result.findUnique({ where: { sessionId: specimenId } });
      if (!record) {
        return undefined;
      }
      const sections = (record.sectionScores as SectionResultRecord[]) ?? [];
      const overall = record.overall ?? averageScore(sections);
      const verdict = record.verdict ?? inferVerdict(overall);
      return {
        specimenId,
        completedAt: record.createdAt.toISOString(),
        sections,
        overall,
        verdict,
      } satisfies ResultRecord;
    }

    const record = this.fallback.get(specimenId);
    if (!record) {
      return undefined;
    }
    const overall = record.overall ?? averageScore(record.sections);
    return {
      ...record,
      overall,
      verdict: record.verdict ?? inferVerdict(overall),
    } satisfies ResultRecord;
  }

  async list(): Promise<ResultRecord[]> {
    if (this.prisma.isEnabled) {
      const rows = await this.prisma.prisma.result.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return rows.map((row: PrismaResultRow) => {
        const sections = (row.sectionScores as SectionResultRecord[]) ?? [];
        const overall = row.overall ?? averageScore(sections);
        const verdict = row.verdict ?? inferVerdict(overall);
        return {
          specimenId: row.sessionId,
          completedAt: row.createdAt.toISOString(),
          sections,
          overall,
          verdict,
        } satisfies ResultRecord;
      });
    }

    const records = Array.from(this.fallback.values()).map((record) => {
      const overall = record.overall ?? averageScore(record.sections);
      return {
        ...record,
        overall,
        verdict: record.verdict ?? inferVerdict(overall),
      } satisfies ResultRecord;
    });

    return records.sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );
  }
}

interface PrismaResultRow {
  sessionId: string;
  createdAt: Date;
  sectionScores: unknown;
  overall: number | null;
  verdict: string | null;
}

function averageScore(sections: SectionResultRecord[]): number {
  if (!sections.length) {
    return 0;
  }
  return sections.reduce((sum, entry) => sum + entry.score, 0) / sections.length;
}

function inferVerdict(overall: number): string {
  if (overall >= 0.85) return 'AI-Adequate';
  if (overall >= 0.7) return 'Task-Narrow';
  if (overall >= 0.5) return 'Heuristic-Local';
  return 'Anthropo-Idiosyncratic';
}
