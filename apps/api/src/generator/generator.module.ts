import { Module } from '@nestjs/common';
import { GeneratorService } from './generator.service.js';

@Module({
  providers: [GeneratorService],
  exports: [GeneratorService],
})
export class GeneratorModule {}
