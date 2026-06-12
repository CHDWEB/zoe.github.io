export const LEVELS = [
  {
    id: "add-10",
    title: "10以内加法",
    description: "先把小数字加法练稳。",
    modes: ["add"],
    maxAnswer: 10,
    goalCorrect: 8,
  },
  {
    id: "sub-10",
    title: "10以内减法",
    description: "练习不慌张地找差。",
    modes: ["subtract"],
    maxAnswer: 10,
    goalCorrect: 8,
  },
  {
    id: "add-20",
    title: "20以内加法",
    description: "加入进位和更大的数。",
    modes: ["add"],
    maxAnswer: 20,
    goalCorrect: 10,
  },
  {
    id: "sub-20",
    title: "20以内减法",
    description: "练习退位减法。",
    modes: ["subtract"],
    maxAnswer: 20,
    goalCorrect: 10,
  },
  {
    id: "mixed-20",
    title: "混合挑战",
    description: "加减法一起出现。",
    modes: ["add", "subtract"],
    maxAnswer: 20,
    goalCorrect: 12,
  },
];

export function createPracticePlan() {
  return LEVELS.map((level) => ({ ...level, modes: [...level.modes] }));
}

function pickInt(maxInclusive, random = Math.random) {
  return Math.floor(random() * (maxInclusive + 1));
}

function pickFrom(items, random = Math.random) {
  return items[Math.floor(random() * items.length)];
}

export function createQuestion(kind = "mixed", random = Math.random, options = {}) {
  const maxAnswer = options.maxAnswer ?? 20;
  const mode = kind === "mixed" ? pickFrom(["add", "subtract"], random) : kind;

  if (mode === "subtract") {
    const a = pickInt(maxAnswer, random);
    const b = pickInt(a, random);
    return {
      a,
      b,
      operator: "-",
      answer: a - b,
    };
  }

  const answer = pickInt(maxAnswer, random);
  const a = pickInt(answer, random);
  return {
    a,
    b: answer - a,
    operator: "+",
    answer,
  };
}

export function createQuestionForLevel(level, random = Math.random) {
  const mode = pickFrom(level.modes, random);
  return createQuestion(mode, random, { maxAnswer: level.maxAnswer });
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
