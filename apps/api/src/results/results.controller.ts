import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ResultsService } from './results.service.js';

@Controller('result')
export class ResultsController {
  constructor(private readonly results: ResultsService) {}

  @Get(':specimenId')
  async findOne(@Param('specimenId') specimenId: string) {
    const record = await this.results.find(specimenId);
    if (!record) {
      throw new NotFoundException('No results available for this specimen.');
    }
    return record;
  }
}
