import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { z } from 'zod';
import { TelemetryService } from './telemetry.service.js';

const telemetrySchema = z.object({
  specimenId: z.string().min(3),
  event: z.enum(['paste', 'focus', 'blur', 'visibility']),
  at: z.string().datetime(),
  payload: z.record(z.any()).optional(),
});

@Controller('event')
export class TelemetryController {
  constructor(private readonly telemetry: TelemetryService) {}

  @Post()
  @HttpCode(204)
  async ingest(@Body() body: unknown) {
    const parsed = telemetrySchema.parse(body);
    await this.telemetry.record(parsed);
  }
}
