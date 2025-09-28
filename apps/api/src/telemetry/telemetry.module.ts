import { Module } from '@nestjs/common';
import { TelemetryController } from './telemetry.controller.js';
import { TelemetryService } from './telemetry.service.js';
import { SessionModule } from '../session/session.module.js';

@Module({
  imports: [SessionModule],
  controllers: [TelemetryController],
  providers: [TelemetryService],
  exports: [TelemetryService],
})
export class TelemetryModule {}
