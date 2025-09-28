import { Injectable } from '@nestjs/common';
import { aggregateScores } from '@hit-arc/engine';

@Injectable()
export class GraderService {
  grade(responses: Array<{ code: string; correctness: number }>) {
    return aggregateScores(responses);
  }
}
