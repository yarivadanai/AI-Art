import { Module } from '@nestjs/common';
import { GraderService } from './grader.service.js';

@Module({
  providers: [GraderService],
  exports: [GraderService],
})
export class GraderModule {}
