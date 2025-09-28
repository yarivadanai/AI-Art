import { Injectable } from '@nestjs/common';
import { generateTestPlan } from '@hit-arc/engine';

@Injectable()
export class GeneratorService {
  build(seed: string) {
    return generateTestPlan(seed);
  }
}
