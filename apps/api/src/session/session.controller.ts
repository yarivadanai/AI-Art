import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateSessionDto } from './session.dto.js';
import { SessionService } from './session.service.js';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  async create(@Body() dto: CreateSessionDto) {
    return this.sessionService.create(dto);
  }

  @Post('consent')
  @HttpCode(204)
  async consent(@Body() dto: CreateSessionDto) {
    await this.sessionService.recordConsent(dto);
  }
}
