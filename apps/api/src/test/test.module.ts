import { Module } from '@nestjs/common';
import { GeneratorModule } from '../generator/generator.module.js';
import { ResultsModule } from '../results/results.module.js';
import { SessionModule } from '../session/session.module.js';
import { TestController } from './test.controller.js';

@Module({
  imports: [SessionModule, GeneratorModule, ResultsModule],
  controllers: [TestController],
})
export class TestModule {}
