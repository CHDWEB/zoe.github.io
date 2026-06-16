import {
  createPracticePlan,
  createQuestionForLevel,
  createSession,
  startQuestion,
  answerQuestion,
  getSessionSummary,
  isLevelPassed,
} from "./logic.mjs";
import { createSoundController } from "./sound.mjs";

const STORAGE_KEY = "math-speed-kids-progress-v1";
const CHALLENGE_SECONDS = 60;

const state = {
  levels: createPracticePlan(),
  currentLevelIndex: 0,
  mode: "practice",
  session: null,
  question: null,
  input: "",
  timerId: null,
  challengeEndsAt: 0,
};

const els = {
  app: document.querySelector("#app"),
  levelTitle: document.querySelector("#levelTitle"),
  levelDescription: document.querySelector("#levelDescription"),
  problem: document.querySelector("#problem"),
  answer: document.querySelector("#answer"),
  feedback: document.querySelector("#feedback"),
  progress: document.querySelector("#progress"),
  score: document.querySelector("#score"),
  accuracy: document.querySelector("#accuracy"),
  streak: document.querySelector("#streak"),
  timer: document.querySelector("#timer"),
  levelTrack: document.querySelector("#levelTrack"),
  keypad: document.querySelector("#keypad"),
  problemCard: document.querySelector("#problemCard"),
  equals: document.querySelector("#equals"),
  startPractice: document.querySelector("#startPractice"),
  startChallenge: document.querySelector("#startChallenge"),
  nextLevel: document.querySelector("#nextLevel"),
  toggleSound: document.querySelector("#toggleSound"),
  resetProgress: document.querySelector("#resetProgress"),
  summary: document.querySelector("#summary"),
  summaryText: document.querySelector("#summaryText"),
};

const sound = createSoundController();

function loadProgress() {
  try {
    const progress = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (Number.isInteger(progress.currentLevelIndex)) {
      state.currentLevelIndex = Math.min(progress.currentLevelIndex, state.levels.length - 1);
    }
  } catch {
    state.currentLevelIndex = 0;
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    currentLevelIndex: state.currentLevelIndex,
    updatedAt: new Date().toISOString(),
  }));
}

function currentLevel() {
  return state.levels[state.currentLevelIndex];
}

function setMode(mode) {
  state.mode = mode;
  state.session = createSession({ mode });
  state.input = "";
  els.summary.hidden = true;
  els.nextLevel.disabled = true;

  if (state.timerId) {
    window.clearInterval(state.timerId);
    state.timerId = null;
  }

  if (mode === "challenge") {
    state.challengeEndsAt = Date.now() + CHALLENGE_SECONDS * 1000;
    state.timerId = window.setInterval(updateTimer, 250);
  }

  newQuestion();
  render();
}

function newQuestion() {
  state.question = createQuestionForLevel(currentLevel());
  state.input = "";
  startQuestion(state.session);
}

function updateTimer() {
  const remaining = Math.max(0, Math.ceil((state.challengeEndsAt - Date.now()) / 1000));
  els.timer.textContent = state.mode === "challenge" ? `${remaining}s` : "练习";
  if (remaining <= 0) {
    finishRound("时间到啦");
  }
}

function finishRound(reason) {
  if (state.timerId) {
    window.clearInterval(state.timerId);
    state.timerId = null;
  }

  const summary = getSessionSummary(state.session);
  sound.play(reason === "时间到啦" ? "finish" : "level");
  els.summary.hidden = false;
  els.summaryText.textContent = `${reason}：答对 ${summary.correct}/${summary.total}，正确率 ${summary.accuracy}% ，平均 ${summary.averageSeconds}s/题。`;

  const passed = state.mode === "practice" && isLevelPassed(state.session, currentLevel());
  els.nextLevel.disabled = !passed || state.currentLevelIndex >= state.levels.length - 1;
  if (passed) {
    els.feedback.textContent = "这一关达标了，可以去下一关。";
    els.feedback.dataset.tone = "good";
  }
}

function advanceToNextLevel() {
  if (state.currentLevelIndex >= state.levels.length - 1) {
    finishRound("全部关卡完成");
    render();
    return;
  }

  state.currentLevelIndex += 1;
  saveProgress();
  setMode("practice");
  els.feedback.textContent = "进入下一关";
  els.feedback.dataset.tone = "good";
  sound.play("level");
}

function submitAnswer() {
  if (!state.session || !state.question || state.input === "") return;

  const correct = answerQuestion(state.session, state.question, Number(state.input));
  const expected = state.question.answer;

  if (correct) {
    els.feedback.textContent = praise();
    els.feedback.dataset.tone = "good";
    sound.play(state.session.streak > 0 && state.session.streak % 5 === 0 ? "streak" : "correct");
  } else {
    els.feedback.textContent = `差一点，正确答案是 ${expected}`;
    els.feedback.dataset.tone = "try";
    sound.play("wrong");
  }

  if (state.mode === "practice" && state.session.correct >= currentLevel().goalCorrect) {
    els.feedback.textContent = "本关完成，准备下一关";
    els.feedback.dataset.tone = "good";
    render();
    window.setTimeout(advanceToNextLevel, 700);
    return;
  }

  window.setTimeout(() => {
    if (state.timerId || state.mode === "practice") {
      newQuestion();
      render();
    }
  }, correct ? 450 : 850);
  render();
}

function praise() {
  const phrases = ["真快", "答对啦", "继续保持", "反应很棒", "连起来了"];
  return phrases[Math.floor(Math.random() * phrases.length)];
}

function handleDigit(value) {
  if (!state.session) setMode("practice");
  if (value !== "enter") sound.play("tap");
  if (value === "back") {
    state.input = state.input.slice(0, -1);
  } else if (value === "clear") {
    state.input = "";
  } else if (value === "enter") {
    submitAnswer();
    return;
  } else if (state.input.length < 2) {
    state.input += value;
  }
  render();
}

function renderLevels() {
  els.levelTrack.innerHTML = "";
  state.levels.forEach((level, index) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "level-dot";
    item.textContent = index + 1;
    item.ariaLabel = level.title;
    item.disabled = index > state.currentLevelIndex;
    item.dataset.active = String(index === state.currentLevelIndex);
    item.addEventListener("click", () => {
      state.currentLevelIndex = index;
      saveProgress();
      setMode("practice");
    });
    els.levelTrack.append(item);
  });
}

function render() {
  const level = currentLevel();
  const expression = state.question
    ? `${state.question.a} ${state.question.operator} ${state.question.b}`
    : "准备开始";
  els.levelTitle.textContent = level.title;
  els.levelDescription.textContent = level.description;
  els.problemCard.dataset.layout = state.question?.layout || level.layout || "horizontal";
  els.problem.textContent = expression;
  els.problem.setAttribute("aria-label", expression);
  els.problem.innerHTML = state.question?.layout === "vertical"
    ? renderVerticalProblem(state.question)
    : expression;
  els.equals.textContent = state.question?.layout === "vertical" ? "" : "=";
  els.answer.textContent = state.input || "?";
  els.timer.textContent = state.mode === "challenge"
    ? `${Math.max(0, Math.ceil((state.challengeEndsAt - Date.now()) / 1000))}s`
    : "练习";

  const summary = state.session ? getSessionSummary(state.session) : {
    total: 0,
    correct: 0,
    accuracy: 0,
    bestStreak: 0,
  };

  els.score.textContent = `${summary.correct}/${Math.max(summary.total, level.goalCorrect)}`;
  els.accuracy.textContent = `${summary.accuracy}%`;
  els.streak.textContent = `${state.session?.streak ?? 0}`;
  els.progress.style.width = `${Math.min(100, (summary.correct / level.goalCorrect) * 100)}%`;
  els.toggleSound.textContent = sound.isEnabled() ? "声音开" : "声音关";
  els.toggleSound.setAttribute("aria-pressed", String(sound.isEnabled()));
  renderLevels();
}

function renderVerticalProblem(question) {
  const top = String(question.a).padStart(2, "0").split("");
  const bottom = String(question.b).padStart(2, "0").split("");
  return `
    <div class="vertical-problem" aria-hidden="true">
      <div class="place-labels"><span>十位</span><span>个位</span></div>
      <div class="vertical-number"><span>${top[0]}</span><span>${top[1]}</span></div>
      <div class="vertical-number vertical-second"><b>${question.operator}</b><span>${bottom[0]}</span><span>${bottom[1]}</span></div>
      <div class="vertical-line"></div>
    </div>
  `;
}

function buildKeypad() {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "back", "enter"];
  const labels = {
    clear: "清空",
    back: "退格",
    enter: "确定",
  };
  els.keypad.innerHTML = "";
  keys.forEach((key) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = key === "enter" ? "key key-enter" : "key";
    button.textContent = labels[key] || key;
    button.dataset.key = key;
    button.addEventListener("click", () => handleDigit(key));
    els.keypad.append(button);
  });
}

els.startPractice.addEventListener("click", () => setMode("practice"));
els.startChallenge.addEventListener("click", () => setMode("challenge"));
els.nextLevel.addEventListener("click", () => {
  advanceToNextLevel();
});
els.toggleSound.addEventListener("click", () => {
  const enabled = sound.toggle();
  if (enabled) sound.play("tap");
  render();
});
els.resetProgress.addEventListener("click", () => {
  state.currentLevelIndex = 0;
  saveProgress();
  setMode("practice");
});

window.addEventListener("keydown", (event) => {
  if (/^\d$/.test(event.key)) handleDigit(event.key);
  if (event.key === "Backspace") handleDigit("back");
  if (event.key === "Enter") handleDigit("enter");
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

loadProgress();
buildKeypad();
setMode("practice");
