import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import {
  type LanguageItem,
  type LanguageResponse,
  type ArithmeticItem,
  type ArithmeticResponse,
} from '@hit-arc/engine';
import { AppModule } from '../src/app.module';
import { CreateSessionDto } from '../src/session/session.dto';
import { SessionService } from '../src/session/session.service';
import { TestController } from '../src/test/test.controller';

describe('TestController (e2e)', () => {
  it('returns a language section for a registered specimen', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const sessionService = moduleRef.get(SessionService);
    const testController = moduleRef.get(TestController);

    const dto = new CreateSessionDto();
    const session = await sessionService.create(dto);

    const response = await testController.start({ specimenId: session.specimenId });

    expect(response.sections[0].code).toBe('A');
    expect(response.sections[0].items.length).toBeGreaterThanOrEqual(8);
    expect(response.expiresAt).toBe(session.expiresAt);

    const languageSection = response.sections.find((section) => section.code === 'A');
    if (!languageSection || languageSection.code !== 'A') {
      throw new Error('Language section not present');
    }
    const responses: LanguageResponse[] = languageSection.items.map((item: LanguageItem) => {
      switch (item.type) {
        case 'spelling':
          return { itemId: item.id, type: 'spelling', selectedIndex: item.correctIndex };
        case 'cloze':
          return {
            itemId: item.id,
            type: 'cloze',
            selectedIndices: [...item.correctIndices],
          };
        case 'analogy':
          return { itemId: item.id, type: 'analogy', selectedIndex: item.correctIndex };
        case 'microwrite':
          return {
            itemId: item.id,
            type: 'microwrite',
            text: item.constraints.mustInclude.join(' ') + ' signal integrity maintained.',
          };
        default:
          throw new Error('Unsupported item type');
      }
    });

    const score = await testController.submit({
      specimenId: session.specimenId,
      sectionCode: 'A',
      responses,
    });

    expect(score.overall).toBeGreaterThan(0.5);

    const arithmeticSection = response.sections.find((section) => section.code === 'B');
    if (!arithmeticSection || arithmeticSection.code !== 'B') {
      throw new Error('Arithmetic section not present');
    }

    const arithmeticResponses: ArithmeticResponse[] = arithmeticSection.items.map(
      (item: ArithmeticItem) => ({
        itemId: item.id,
        type: 'arith',
        answer: item.expected,
      }),
    );

    const arithmeticScore = await testController.submit({
      specimenId: session.specimenId,
      sectionCode: 'B',
      responses: arithmeticResponses,
    });

    expect(arithmeticScore.overall).toBeGreaterThan(0.5);

    const gridSection = response.sections.find((section) => section.code === 'C');
    if (!gridSection || gridSection.code !== 'C') {
      throw new Error('Grid section not present');
    }
    const gridResponses = gridSection.items.map((item) => ({
      itemId: item.id,
      type: 'grid' as const,
      selectedIndex: item.correctIndex,
    }));
    const gridScore = await testController.submit({
      specimenId: session.specimenId,
      sectionCode: 'C',
      responses: gridResponses,
    });
    expect(gridScore.overall).toBeGreaterThan(0.5);

    const perceptionSection = response.sections.find((section) => section.code === 'D');
    if (!perceptionSection || perceptionSection.code !== 'D') {
      throw new Error('Perception section not present');
    }
    const perceptionResponses = perceptionSection.items.map((item) => ({
      itemId: item.id,
      type: 'perception' as const,
      selectedIndex: item.correctIndex,
    }));
    const perceptionScore = await testController.submit({
      specimenId: session.specimenId,
      sectionCode: 'D',
      responses: perceptionResponses,
    });
    expect(perceptionScore.overall).toBeGreaterThan(0.5);

    const scienceSection = response.sections.find((section) => section.code === 'E');
    if (!scienceSection || scienceSection.code !== 'E') {
      throw new Error('Science section not present');
    }
    const scienceResponses = scienceSection.items.map((item) => ({
      itemId: item.id,
      type: item.type,
      selectedIndex: item.correctIndex,
    }));
    const scienceScore = await testController.submit({
      specimenId: session.specimenId,
      sectionCode: 'E',
      responses: scienceResponses,
    });
    expect(scienceScore.overall).toBeGreaterThan(0.5);

    const generativeSection = response.sections.find((section) => section.code === 'F');
    if (!generativeSection || generativeSection.code !== 'F') {
      throw new Error('Generative section not present');
    }
    const generativeResponses = generativeSection.items.map((item) => ({
      itemId: item.id,
      type: 'constrained' as const,
      text: `${item.constraints.mustInclude.join(' ')} calibrated output`,
    }));
    const generativeScore = await testController.submit({
      specimenId: session.specimenId,
      sectionCode: 'F',
      responses: generativeResponses,
    });
    expect(generativeScore.overall).toBeGreaterThan(0.5);

    await moduleRef.close();
  });
});
