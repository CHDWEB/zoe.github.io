export const LEVELS = [
  {
    id: "vertical-add-100",
    title: "两位数加法竖式",
    description: "个位对个位，十位对十位，不进位。",
    modes: ["add"],
    layout: "vertical",
    goalCorrect: 8,
  },
  {
    id: "vertical-subtract-100",
    title: "两位数减法竖式",
    description: "个位够减，十位够减，不退位。",
    modes: ["subtract"],
    layout: "vertical",
    goalCorrect: 8,
  },
  {
    id: "vertical-mixed-100",
    title: "竖式混合练习",
    description: "加减法混合出现，先看清符号。",
    modes: ["add", "subtract"],
    layout: "vertical",
    goalCorrect: 10,
  },
  {
    id: "horizontal-add-100",
    title: "横式加法",
    description: "换成横式，继续练不进位加法。",
    modes: ["add"],
    layout: "horizontal",
    goalCorrect: 10,
  },
  {
    id: "horizontal-subtract-100",
    title: "横式减法",
    description: "横式练不退位减法。",
    modes: ["subtract"],
    layout: "horizontal",
    goalCorrect: 12,
  },
  {
    id: "horizontal-mixed-100",
    title: "横式混合挑战",
    description: "100以内两位数加减混合。",
    modes: ["add", "subtract"],
    layout: "horizontal",
    goalCorrect: 12,
  },
];

export function createPracticePlan() {
  return LEVELS.map((level) => ({ ...level, modes: [...level.modes] }));
}

function pickInt(maxInclusive, random = Math.random) {
  return Math.floor(random() * (maxInclusive + 1));
}

function pickIntRange(minInclusive, maxInclusive, random = Math.random) {
  return minInclusive + pickInt(maxInclusive - minInclusive, random);
}

function pickFrom(items, random = Math.random) {
  return items[Math.floor(random() * items.length)];
}

export function createQuestion(kind = "mixed", random = Math.random) {
  const mode = kind === "mixed" ? pickFrom(["add", "subtract"], random) : kind;

  if (mode === "subtract") {
    const aTens = pickIntRange(1, 9, random);
    const aOnes = pickIntRange(0, 9, random);
    const bTens = pickIntRange(1, aTens, random);
    const bOnes = pickIntRange(0, aOnes, random);
    const a = aTens * 10 + aOnes;
    const b = bTens * 10 + bOnes;
    return {
      a,
      b,
      operator: "-",
      answer: a - b,
    };
  }

  const aTens = pickIntRange(1, 8, random);
  const aOnes = pickIntRange(0, 9, random);
  const bTens = pickIntRange(1, 9 - aTens, random);
  const bOnes = pickIntRange(0, 9 - aOnes, random);
  const a = aTens * 10 + aOnes;
  const b = bTens * 10 + bOnes;
  return {
    a,
    b,
    operator: "+",
    answer: a + b,
  };
}

export function createQuestionForLevel(level, random = Math.random) {
  const mode = pickFrom(level.modes, random);
  return {
    ...createQuestion(mode, random),
    layout: level.layout,
  };
}

export function createSession({ mode = "practice", now = () => Date.now() } = {}) {
  return {
    mode,
    startedAt: now(),
    questionStartedAt: now(),
    total: 0,
    correct: 0,
    streak: 0,
    bestStreak: 0,
    totalAnswerMs: 0,
    history: [],
  };
}

export function startQuestion(session, now = () => Date.now()) {
  session.questionStartedAt = now();
}

export function answerQuestion(session, question, givenAnswer, now = () => Date.now()) {
  const elapsedMs = Math.max(0, now() - session.questionStartedAt);
  const correct = Number(givenAnswer) === question.answer;

  session.total += 1;
  session.correct += correct ? 1 : 0;
  session.streak = correct ? session.streak + 1 : 0;
  session.bestStreak = Math.max(session.bestStreak, session.streak);
  session.totalAnswerMs += elapsedMs;
  session.history.push({
    question,
    givenAnswer: Number(givenAnswer),
    correct,
    elapsedMs,
  });
  session.questionStartedAt = now();

  return correct;
}

export function getSessionSummary(session) {
  const accuracy = session.total === 0 ? 0 : Math.round((session.correct / session.total) * 100);
  const averageSeconds = session.total === 0
    ? 0
    : Number((session.totalAnswerMs / session.total / 1000).toFixed(2));

  return {
    total: session.total,
    correct: session.correct,
    accuracy,
    bestStreak: session.bestStreak,
    averageSeconds,
  };
}

export function isLevelPassed(session, level) {
  const summary = getSessionSummary(session);
  return summary.correct >= level.goalCorrect && summary.accuracy >= 80;
}
