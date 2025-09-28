import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
} from '@nestjs/common';
import {
  gradeLanguageSection,
  gradeArithmeticSection,
  gradeGridSection,
  gradePerceptionSection,
  gradeScienceSection,
  gradeGenerativeSection,
  type LanguageResponse,
  type LanguageSectionScore,
  type ArithmeticResponse,
  type ArithmeticSectionScore,
  type GridReasoningResponse,
  type GridReasoningResult,
  type PerceptionResponse,
  type PerceptionSectionScore,
  type ScienceResponse,
  type ScienceSectionScore,
  type GenerativeResponse,
  type GenerativeSectionScore,
  type TestPlan,
} from '@hit-arc/engine';
import { GeneratorService } from '../generator/generator.service.js';
import { ResultsService } from '../results/results.service.js';
import { SessionService } from '../session/session.service.js';
import { StartTestDto } from './dto/start-test.dto.js';
import { SubmitSectionDto } from './dto/submit-section.dto.js';

interface TestStartResponse extends TestPlan {
  expiresAt: string;
}

@Controller('test')
export class TestController {
  constructor(
    private readonly sessions: SessionService,
    private readonly generator: GeneratorService,
    private readonly results: ResultsService,
  ) {}

  @Post('start')
  @HttpCode(HttpStatus.OK)
  async start(@Body() dto: StartTestDto): Promise<TestStartResponse> {
    const session = await this.sessions.get(dto.specimenId);

    if (!session) {
      throw new NotFoundException('Specimen not registered for a session.');
    }

    const plan = this.generator.build(session.seed);

    return {
      sections: plan.sections,
      expiresAt: session.expiresAt,
    };
  }

  @Post('submit')
  @HttpCode(HttpStatus.OK)
  async submit(
    @Body() dto: SubmitSectionDto,
  ): Promise<
    | LanguageSectionScore
    | ArithmeticSectionScore
    | GridReasoningResult
    | PerceptionSectionScore
    | ScienceSectionScore
    | GenerativeSectionScore
  > {
    const session = await this.sessions.get(dto.specimenId);
    if (!session) {
      throw new NotFoundException('Specimen not registered for a session.');
    }

    const plan = this.generator.build(session.seed);
    const section = plan.sections.find((entry) => entry.code === dto.sectionCode);

    if (!section) {
      throw new BadRequestException(
        `Section ${dto.sectionCode} is not available for this session.`,
      );
    }

    switch (section.code) {
      case 'A': {
        const responses = (dto.responses ?? []) as LanguageResponse[];
        const score = gradeLanguageSection(section, responses);
        await this.results.saveSection(session.specimenId, {
          code: section.code,
          label: section.label,
          score: score.overall,
          details: score,
        });
        return score;
      }
      case 'B': {
        const responses = (dto.responses ?? []) as ArithmeticResponse[];
        const score = gradeArithmeticSection(section, responses);
        await this.results.saveSection(session.specimenId, {
          code: section.code,
          label: section.label,
          score: score.overall,
          details: score,
        });
        return score;
      }
      case 'C': {
        const responses = (dto.responses ?? []) as GridReasoningResponse[];
        const score = gradeGridSection(section, responses);
        await this.results.saveSection(session.specimenId, {
          code: section.code,
          label: section.label,
          score: score.overall,
          details: score,
        });
        return score;
      }
      case 'D': {
        const responses = (dto.responses ?? []) as PerceptionResponse[];
        const score = gradePerceptionSection(section, responses);
        await this.results.saveSection(session.specimenId, {
          code: section.code,
          label: section.label,
          score: score.overall,
          details: score,
        });
        return score;
      }
      case 'E': {
        const responses = (dto.responses ?? []) as ScienceResponse[];
        const score = gradeScienceSection(section, responses);
        await this.results.saveSection(session.specimenId, {
          code: section.code,
          label: section.label,
          score: score.overall,
          details: score,
        });
        return score;
      }
      case 'F': {
        const responses = (dto.responses ?? []) as GenerativeResponse[];
        const score = gradeGenerativeSection(section, responses);
        await this.results.saveSection(session.specimenId, {
          code: section.code,
          label: section.label,
          score: score.overall,
          details: score,
        });
        return score;
      }
      default:
        throw new BadRequestException('Section submission not yet supported.');
    }
  }
}
