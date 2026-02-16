import { AnswerKey } from '@/lib/types';

export function gradeAnswer(
  userAnswer: string | number | string[],
  answerKey: AnswerKey
): { correct: boolean; score: number } {
  const { correct, partialCredit, tolerance } = answerKey;

  // Multiple choice / exact match (number)
  if (typeof correct === 'number') {
    if (tolerance) {
      const diff = Math.abs(Number(userAnswer) - correct);
      return { correct: diff <= tolerance, score: diff <= tolerance ? 1 : 0 };
    }
    const isCorrect = Number(userAnswer) === correct;
    return { correct: isCorrect, score: isCorrect ? 1 : 0 };
  }

  // String match
  if (typeof correct === 'string') {
    if (tolerance) {
      const diff = Math.abs(Number(userAnswer) - Number(correct));
      return { correct: diff <= tolerance, score: diff <= tolerance ? 1 : 0 };
    }

    const userStr = String(userAnswer).trim().toLowerCase();

    // Keywords: if any keyword appears as substring in user answer → correct
    if (answerKey.keywords && answerKey.keywords.length > 0) {
      const matched = answerKey.keywords.some(kw =>
        userStr.includes(kw.toLowerCase())
      );
      if (matched) return { correct: true, score: 1 };
    }

    // Alternatives: exact match against correct or any alternative
    if (answerKey.alternatives && answerKey.alternatives.length > 0) {
      const allAccepted = [correct, ...answerKey.alternatives].map(s =>
        s.trim().toLowerCase()
      );
      const matched = allAccepted.includes(userStr);
      if (matched) return { correct: true, score: 1 };
      return { correct: false, score: 0 };
    }

    const isCorrect = userStr === correct.trim().toLowerCase();
    return { correct: isCorrect, score: isCorrect ? 1 : 0 };
  }

  // Array match (sequence questions with partial credit)
  if (Array.isArray(correct)) {
    let userArr: string[];
    if (Array.isArray(userAnswer)) {
      userArr = userAnswer;
    } else {
      // If correct is an array of single characters, split input into characters
      // This handles digit-span where user types "12345" and correct is ["1","2","3","4","5"]
      const str = String(userAnswer);
      userArr = correct.every((c) => c.length === 1)
        ? str.split("")
        : [str];
    }

    if (partialCredit) {
      let matches = 0;
      for (let i = 0; i < correct.length; i++) {
        if (
          userArr[i] &&
          String(userArr[i]).trim().toLowerCase() ===
            correct[i].trim().toLowerCase()
        ) {
          matches++;
        }
      }
      const score = matches / correct.length;
      return { correct: score === 1, score };
    }

    const isCorrect =
      JSON.stringify(userArr.map(s => String(s).trim().toLowerCase())) ===
      JSON.stringify(correct.map(s => s.trim().toLowerCase()));
    return { correct: isCorrect, score: isCorrect ? 1 : 0 };
  }

  return { correct: false, score: 0 };
}
