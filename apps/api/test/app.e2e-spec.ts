import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { SessionService } from '../src/session/session.service';

describe('AppModule (integration)', () => {
  it('creates session records via SessionService', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const sessionService = moduleRef.get(SessionService);
    const record = await sessionService.create({ specimenAlias: 'spec-test' });

    expect(record.seed).toBeDefined();
    expect(record.specimenId).toBe('spec-test');
    expect(record.token).toBeDefined();

    await moduleRef.close();
  });
});
