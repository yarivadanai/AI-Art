import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeneratorModule } from './generator/generator.module';
import { GraderModule } from './grader/grader.module';
import { PrismaModule } from './prisma/prisma.module';
import { ResultsModule } from './results/results.module';
import { SessionModule } from './session/session.module';
import { StatsModule } from './stats/stats.module';
import { TelemetryModule } from './telemetry/telemetry.module';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    SessionModule,
    GeneratorModule,
    GraderModule,
    ResultsModule,
    TelemetryModule,
    TestModule,
    StatsModule,
  ],
})
export class AppModule {}
