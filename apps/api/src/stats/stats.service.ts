import { Injectable } from '@nestjs/common';
import { seedToColor } from '@hit-arc/engine';
import { ResultRecord, ResultsService } from '../results/results.service.js';
import { SessionRecord, SessionService } from '../session/session.service.js';
import { TelemetryRecord, TelemetryService } from '../telemetry/telemetry.service.js';

export interface DashboardStats {
  completionRate: number;
  medianScore: number;
  calibrationDelta: number;
  suspicionRate: number;
  verdictDistribution: Array<{ label: string; value: number }>;
  sectionAverages: Array<{ code: string; label: string; score: number }>;
  latestSpecimens: Array<{ specimenId: string; color: string; verdict: string; overall: number }>;
  narrative: string;
  telemetryEvents: Array<{ specimenId: string; event: string; at: string }>;
}

@Injectable()
export class StatsService {
  private static readonly SUSPICION_THRESHOLD = 0.5;

  constructor(
    private readonly sessions: SessionService,
    private readonly results: ResultsService,
    private readonly telemetry: TelemetryService,
  ) {}

  async getDashboardStats(): Promise<DashboardStats> {
    const [sessionRecords, resultRecords, telemetryEvents] = await Promise.all([
      this.sessions.list(),
      this.results.list(),
      this.telemetry.recent(12),
    ]);

    return this.composeDashboard(sessionRecords, resultRecords, telemetryEvents);
  }

  private composeDashboard(
    sessions: SessionRecord[],
    results: ResultRecord[],
    telemetry: TelemetryRecord[],
  ): DashboardStats {
    const sessionCount = sessions.length;
    const completionRate = sessionCount === 0 ? 0 : Math.min(1, results.length / sessionCount);

    const overalls = results
      .map((record) => record.overall ?? this.averageSectionScore(record))
      .filter((value) => Number.isFinite(value)) as number[];
    const medianScore = overalls.length ? median(overalls) : 0;

    const sectionAverages = this.computeSectionAverages(results);
    const highestSection = sectionAverages.length
      ? sectionAverages.reduce((best, current) => (current.score > best.score ? current : best))
      : undefined;
    const lowestSection = sectionAverages.length
      ? sectionAverages.reduce((worst, current) => (current.score < worst.score ? current : worst))
      : undefined;
    const calibrationDelta =
      highestSection && lowestSection ? lowestSection.score - highestSection.score : 0;

    const verdictDistribution = this.computeVerdictDistribution(results);

    const sessionsBySpecimen = new Map<string, SessionRecord>();
    sessions.forEach((session) => {
      sessionsBySpecimen.set(session.specimenId, session);
    });

    const suspiciousCount = results.reduce((acc, record) => {
      const suspicion = sessionsBySpecimen.get(record.specimenId)?.suspicion ?? 0;
      return acc + (suspicion > StatsService.SUSPICION_THRESHOLD ? 1 : 0);
    }, 0);
    const suspicionRate = results.length === 0 ? 0 : suspiciousCount / results.length;

    const latestSpecimens = results.slice(0, 6).map((record) => {
      const session = sessionsBySpecimen.get(record.specimenId);
      const overall = record.overall ?? this.averageSectionScore(record);
      return {
        specimenId: record.specimenId,
        color: seedToColor(session?.seed ?? record.specimenId),
        verdict: (record.verdict ?? 'Undetermined') || 'Undetermined',
        overall,
      };
    });

    const telemetryEvents = telemetry.map((event) => ({
      specimenId: event.specimenId,
      event: event.event,
      at: event.at,
    }));

    const narrative = this.buildNarrative({
      verdictDistribution,
      highestSection,
      lowestSection,
      suspicionRate,
      medianScore,
    });

    return {
      completionRate,
      medianScore,
      calibrationDelta,
      suspicionRate,
      verdictDistribution,
      sectionAverages,
      latestSpecimens,
      narrative,
      telemetryEvents,
    };
  }

  private computeSectionAverages(results: ResultRecord[]) {
    const accumulator = new Map<string, { label: string; sum: number; count: number }>();
    results.forEach((record) => {
      record.sections.forEach((section) => {
        const current = accumulator.get(section.code) ?? { label: section.label, sum: 0, count: 0 };
        accumulator.set(section.code, {
          label: section.label,
          sum: current.sum + (section.score ?? 0),
          count: current.count + 1,
        });
      });
    });

    return Array.from(accumulator.entries())
      .map(([code, entry]) => ({
        code,
        label: entry.label,
        score: entry.count === 0 ? 0 : entry.sum / entry.count,
      }))
      .sort((a, b) => a.code.localeCompare(b.code));
  }

  private computeVerdictDistribution(results: ResultRecord[]) {
    const counts = new Map<string, number>();
    results.forEach((record) => {
      const verdict = (record.verdict ?? 'Undetermined') || 'Undetermined';
      counts.set(verdict, (counts.get(verdict) ?? 0) + 1);
    });

    const total = Array.from(counts.values()).reduce((sum, value) => sum + value, 0);
    if (total === 0) {
      return [{ label: 'Undetermined', value: 1 }];
    }

    return Array.from(counts.entries())
      .map(([label, count]) => ({ label, value: count / total }))
      .sort((a, b) => b.value - a.value);
  }

  private averageSectionScore(record: ResultRecord): number {
    if (!record.sections.length) {
      return 0;
    }
    return (
      record.sections.reduce((sum, section) => sum + (section.score ?? 0), 0) /
      record.sections.length
    );
  }

  private buildNarrative({
    verdictDistribution,
    highestSection,
    lowestSection,
    suspicionRate,
    medianScore,
  }: {
    verdictDistribution: Array<{ label: string; value: number }>;
    highestSection?: { code: string; label: string; score: number };
    lowestSection?: { code: string; label: string; score: number };
    suspicionRate: number;
    medianScore: number;
  }): string {
    if (!verdictDistribution.length || !highestSection || !lowestSection) {
      return 'Authority awaiting sufficient specimens to determine humanity-wide calibration drift.';
    }

    const leadingVerdict = verdictDistribution[0];
    const verdictPercent = (leadingVerdict.value * 100).toFixed(0);
    const delta = Math.abs(highestSection.score - lowestSection.score) * 100;
    const suspicionPercent = (suspicionRate * 100).toFixed(1);
    const medianPercent = (medianScore * 100).toFixed(1);

    return `Authority observes ${leadingVerdict.label} leading at ${verdictPercent}% with median score ${medianPercent}%. ${highestSection.label} outpaces ${lowestSection.label} by ${delta.toFixed(1)} pts while telemetry raised suspicion flags on ${suspicionPercent}% of specimens.`;
  }
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}
