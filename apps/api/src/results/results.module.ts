import { Module } from '@nestjs/common';
import { ResultsService } from './results.service.js';
import { ResultsController } from './results.controller.js';

@Module({
  providers: [ResultsService],
  controllers: [ResultsController],
  exports: [ResultsService],
})
export class ResultsModule {}
