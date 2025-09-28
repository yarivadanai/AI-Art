import { Module } from '@nestjs/common';
import { SessionController } from './session.controller.js';
import { SessionTokenService } from './session-token.service.js';
import { SessionService } from './session.service.js';

@Module({
  controllers: [SessionController],
  providers: [SessionService, SessionTokenService],
  exports: [SessionService],
})
export class SessionModule {}
