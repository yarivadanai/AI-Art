import { Module } from '@nestjs/common';
import { ResultsModule } from '../results/results.module.js';
import { SessionModule } from '../session/session.module.js';
import { TelemetryModule } from '../telemetry/telemetry.module.js';
import { StatsController } from './stats.controller.js';
import { StatsService } from './stats.service.js';

@Module({
  imports: [SessionModule, ResultsModule, TelemetryModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
