import {
  createPracticePlan,
  createQuestionForLevel,
  createSession,
  startQuestion,
  answerQuestion,
  getSessionSummary,
  isLevelPassed,
} from "./logic.mjs";
import {
  createSentencePlan,
  createSentenceQuestion,
  createWordPlan,
  createWordQuestion,
} from "./english.mjs";
import {
  cellKey,
  createSudokuGame,
  findConflicts,
  isSolved,
} from "./sudoku.mjs";
import { createSoundController } from "./sound.mjs";

const STORAGE_KEY = "math-speed-kids-progress-v1";
const ENGLISH_STORAGE_KEY = "english-speed-kids-progress-v1";
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

const englishState = {
  wordLevels: createWordPlan(),
  sentenceLevels: createSentencePlan(),
  mode: "word",
  wordLevelIndex: 0,
  sentenceLevelIndex: 0,
  usedWords: new Set(),
  session: null,
  question: null,
};

const sudokuState = {
  game: createSudokuGame({ size: 6, difficulty: "simple" }),
  size: 6,
  difficulty: "simple",
  noteMode: false,
  notes: createSudokuNotes(6),
  elapsedStartedAt: null,
  timerId: null,
  countdownMinutes: 5,
  countdownEndsAt: null,
  countdownActive: false,
  locked: false,
  selected: null,
};

const els = {
  app: document.querySelector("#app"),
  lobby: document.querySelector("#lobby"),
  mathGame: document.querySelector("#mathGame"),
  englishGame: document.querySelector("#englishGame"),
  openMath: document.querySelector("#openMath"),
  openEnglish: document.querySelector("#openEnglish"),
  backFromMath: document.querySelector("#backFromMath"),
  backFromMathMenu: document.querySelector("#backFromMathMenu"),
  mathModeMenu: document.querySelector("#mathModeMenu"),
  openArithmetic: document.querySelector("#openArithmetic"),
  openSudoku: document.querySelector("#openSudoku"),
  arithmeticGame: document.querySelector("#arithmeticGame"),
  sudokuGame: document.querySelector("#sudokuGame"),
  backFromArithmetic: document.querySelector("#backFromArithmetic"),
  backFromSudoku: document.querySelector("#backFromSudoku"),
  backFromEnglishMenu: document.querySelector("#backFromEnglishMenu"),
  englishModeMenu: document.querySelector("#englishModeMenu"),
  openWordGame: document.querySelector("#openWordGame"),
  openSentenceGame: document.querySelector("#openSentenceGame"),
  englishPractice: document.querySelector("#englishPractice"),
  backFromEnglishPractice: document.querySelector("#backFromEnglishPractice"),
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
  englishLevelTitle: document.querySelector("#englishLevelTitle"),
  englishLevelDescription: document.querySelector("#englishLevelDescription"),
  englishMode: document.querySelector("#englishMode"),
  englishLevelTrack: document.querySelector("#englishLevelTrack"),
  englishScore: document.querySelector("#englishScore"),
  englishAccuracy: document.querySelector("#englishAccuracy"),
  englishStreak: document.querySelector("#englishStreak"),
  englishProgress: document.querySelector("#englishProgress"),
  englishPromptLabel: document.querySelector("#englishPromptLabel"),
  englishWord: document.querySelector("#englishWord"),
  speakWord: document.querySelector("#speakWord"),
  englishFeedback: document.querySelector("#englishFeedback"),
  englishChoices: document.querySelector("#englishChoices"),
  startEnglish: document.querySelector("#startEnglish"),
  toggleSoundEnglish: document.querySelector("#toggleSoundEnglish"),
  resetEnglish: document.querySelector("#resetEnglish"),
  englishSummary: document.querySelector("#englishSummary"),
  englishSummaryText: document.querySelector("#englishSummaryText"),
  sudokuStatus: document.querySelector("#sudokuStatus"),
  sudokuElapsed: document.querySelector("#sudokuElapsed"),
  sudokuCountdown: document.querySelector("#sudokuCountdown"),
  sudokuMinutes: document.querySelector("#sudokuMinutes"),
  sudokuMinutesValue: document.querySelector("#sudokuMinutesValue"),
  sudokuRule: document.querySelector("#sudokuRule"),
  sudokuGrid: document.querySelector("#sudokuGrid"),
  sudokuFeedback: document.querySelector("#sudokuFeedback"),
  sudokuSize6: document.querySelector("#sudokuSize6"),
  sudokuSize9: document.querySelector("#sudokuSize9"),
  sudokuSimple: document.querySelector("#sudokuSimple"),
  sudokuNormal: document.querySelector("#sudokuNormal"),
  sudokuChallenge: document.querySelector("#sudokuChallenge"),
  sudokuNotes: document.querySelector("#sudokuNotes"),
  sudokuPad: document.querySelector("#sudokuPad"),
  newSudoku: document.querySelector("#newSudoku"),
  resetSudoku: document.querySelector("#resetSudoku"),
  startSudokuCountdown: document.querySelector("#startSudokuCountdown"),
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

function loadEnglishProgress() {
  try {
    const progress = JSON.parse(localStorage.getItem(ENGLISH_STORAGE_KEY) || "{}");
    if (Number.isInteger(progress.wordLevelIndex)) {
      englishState.wordLevelIndex = Math.min(progress.wordLevelIndex, englishState.wordLevels.length - 1);
    } else if (Number.isInteger(progress.currentLevelIndex)) {
      englishState.wordLevelIndex = Math.min(progress.currentLevelIndex, englishState.wordLevels.length - 1);
    }
    if (Number.isInteger(progress.sentenceLevelIndex)) {
      englishState.sentenceLevelIndex = Math.min(progress.sentenceLevelIndex, englishState.sentenceLevels.length - 1);
    }
  } catch {
    englishState.wordLevelIndex = 0;
    englishState.sentenceLevelIndex = 0;
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    currentLevelIndex: state.currentLevelIndex,
    updatedAt: new Date().toISOString(),
  }));
}

function saveEnglishProgress() {
  localStorage.setItem(ENGLISH_STORAGE_KEY, JSON.stringify({
    wordLevelIndex: englishState.wordLevelIndex,
    sentenceLevelIndex: englishState.sentenceLevelIndex,
    updatedAt: new Date().toISOString(),
  }));
}

function currentLevel() {
  return state.levels[state.currentLevelIndex];
}

function currentEnglishLevel() {
  return englishState.mode === "sentence"
    ? englishState.sentenceLevels[englishState.sentenceLevelIndex]
    : englishState.wordLevels[englishState.wordLevelIndex];
}

function createSudokuNotes(size) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => []));
}

function formatClock(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function showScreen(screen) {
  els.lobby.hidden = screen !== "lobby";
  els.mathGame.hidden = screen !== "math";
  els.englishGame.hidden = screen !== "english";
}

function showLobby() {
  if (state.timerId) {
    window.clearInterval(state.timerId);
    state.timerId = null;
  }
  showScreen("lobby");
}

function showMathMenu() {
  showScreen("math");
  els.mathModeMenu.hidden = false;
  els.arithmeticGame.hidden = true;
  els.sudokuGame.hidden = true;
}

function showArithmetic() {
  els.mathModeMenu.hidden = true;
  els.arithmeticGame.hidden = false;
  els.sudokuGame.hidden = true;
}

function showSudoku() {
  els.mathModeMenu.hidden = true;
  els.arithmeticGame.hidden = true;
  els.sudokuGame.hidden = false;
}

function showEnglishMenu() {
  showScreen("english");
  els.englishModeMenu.hidden = false;
  els.englishPractice.hidden = true;
}

function showEnglishPractice() {
  showScreen("english");
  els.englishModeMenu.hidden = true;
  els.englishPractice.hidden = false;
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

function startMath(mode = "practice") {
  showScreen("math");
  showArithmetic();
  setMode(mode);
}

function openSudokuGame() {
  showScreen("math");
  showSudoku();
  setSudokuDifficulty(sudokuState.difficulty);
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

function startEnglish(mode = "word") {
  englishState.mode = mode;
  englishState.usedWords = new Set();
  showEnglishPractice();
  englishState.session = createSession({ mode: "english" });
  els.englishSummary.hidden = true;
  newEnglishQuestion();
  renderEnglish();
}

function newEnglishQuestion() {
  if (englishState.mode === "sentence") {
    englishState.question = createSentenceQuestion(currentEnglishLevel());
  } else {
    englishState.question = createWordQuestion(currentEnglishLevel(), Math.random, englishState.usedWords);
    englishState.usedWords.add(englishState.question.word);
  }
  startQuestion(englishState.session);
}

function speakCurrentWord() {
  const text = englishState.question?.speakText || englishState.question?.word;
  if (!text || !("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.82;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function answerEnglish(choice) {
  if (!englishState.session || !englishState.question) return;
  const correct = answerQuestion(englishState.session, englishState.question, choice);

  if (correct) {
    els.englishFeedback.textContent = englishState.session.streak > 0 && englishState.session.streak % 5 === 0
      ? "连对奖励"
      : "答对啦";
    els.englishFeedback.dataset.tone = "good";
    sound.play(englishState.session.streak > 0 && englishState.session.streak % 5 === 0 ? "streak" : "correct");
  } else {
    els.englishFeedback.textContent = `正确答案是 ${englishState.question.answer}`;
    els.englishFeedback.dataset.tone = "try";
    sound.play("wrong");
  }

  if (englishState.session.correct >= currentEnglishLevel().goalCorrect) {
    els.englishFeedback.textContent = "本关完成，准备下一关";
    els.englishFeedback.dataset.tone = "good";
    renderEnglish();
    window.setTimeout(advanceEnglishLevel, 700);
    return;
  }

  window.setTimeout(() => {
    newEnglishQuestion();
    renderEnglish();
  }, correct ? 450 : 850);
  renderEnglish();
}

function advanceEnglishLevel() {
  const levels = englishState.mode === "sentence" ? englishState.sentenceLevels : englishState.wordLevels;
  const currentIndex = englishState.mode === "sentence" ? englishState.sentenceLevelIndex : englishState.wordLevelIndex;
  if (currentIndex >= levels.length - 1) {
    const summary = getSessionSummary(englishState.session);
    sound.play("finish");
    els.englishSummary.hidden = false;
    els.englishSummaryText.textContent = `全部关卡完成：答对 ${summary.correct}/${summary.total}，正确率 ${summary.accuracy}% 。`;
    renderEnglish();
    return;
  }

  if (englishState.mode === "sentence") {
    englishState.sentenceLevelIndex += 1;
  } else {
    englishState.wordLevelIndex += 1;
  }
  saveEnglishProgress();
  startEnglish(englishState.mode);
  els.englishFeedback.textContent = "进入下一关";
  els.englishFeedback.dataset.tone = "good";
  sound.play("level");
}

function renderEnglishLevels() {
  els.englishLevelTrack.innerHTML = "";
  const levels = englishState.mode === "sentence" ? englishState.sentenceLevels : englishState.wordLevels;
  const currentIndex = englishState.mode === "sentence" ? englishState.sentenceLevelIndex : englishState.wordLevelIndex;
  levels.forEach((level, index) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "level-dot";
    item.textContent = index + 1;
    item.ariaLabel = level.title;
    item.disabled = index > currentIndex;
    item.dataset.active = String(index === currentIndex);
    item.addEventListener("click", () => {
      if (englishState.mode === "sentence") {
        englishState.sentenceLevelIndex = index;
      } else {
        englishState.wordLevelIndex = index;
      }
      saveEnglishProgress();
      startEnglish(englishState.mode);
    });
    els.englishLevelTrack.append(item);
  });
}

function renderEnglish() {
  const level = currentEnglishLevel();
  const summary = englishState.session ? getSessionSummary(englishState.session) : {
    total: 0,
    correct: 0,
    accuracy: 0,
    bestStreak: 0,
  };

  els.englishLevelTitle.textContent = level.title;
  els.englishLevelDescription.textContent = level.description;
  els.englishMode.textContent = "练习";
  els.englishPromptLabel.textContent = englishState.mode === "sentence" ? "请选择正确的单词" : "请选择中文意思";
  els.englishWord.textContent = englishState.question?.prompt || englishState.question?.word || "ready";
  els.englishScore.textContent = `${summary.correct}/${Math.max(summary.total, level.goalCorrect)}`;
  els.englishAccuracy.textContent = `${summary.accuracy}%`;
  els.englishStreak.textContent = `${englishState.session?.streak ?? 0}`;
  els.englishProgress.style.width = `${Math.min(100, (summary.correct / level.goalCorrect) * 100)}%`;
  els.toggleSoundEnglish.textContent = sound.isEnabled() ? "声音开" : "声音关";
  els.toggleSoundEnglish.setAttribute("aria-pressed", String(sound.isEnabled()));

  els.englishChoices.innerHTML = "";
  els.englishChoices.dataset.count = String(englishState.question?.options?.length || 0);
  (englishState.question?.options || []).forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    button.textContent = option;
    button.dataset.choice = option;
    button.addEventListener("click", () => answerEnglish(option));
    els.englishChoices.append(button);
  });

  renderEnglishLevels();
}

function updateSudokuMinutesLabel() {
  els.sudokuMinutes.value = String(sudokuState.countdownMinutes);
  els.sudokuMinutesValue.textContent = `${sudokuState.countdownMinutes} 分钟`;
}

function stopSudokuCountdown() {
  sudokuState.countdownActive = false;
  sudokuState.countdownEndsAt = null;
  sudokuState.locked = false;
}

function startSudokuClock({ resetCountdown = false } = {}) {
  sudokuState.elapsedStartedAt = Date.now();
  sudokuState.locked = false;
  sudokuState.selected = null;
  if (resetCountdown) {
    stopSudokuCountdown();
  }
  if (!sudokuState.timerId) {
    sudokuState.timerId = window.setInterval(updateSudokuClock, 1000);
  }
  updateSudokuClock();
}

function lockSudokuAfterCountdown() {
  sudokuState.countdownActive = false;
  sudokuState.countdownEndsAt = null;
  sudokuState.locked = true;
  sudokuState.noteMode = false;
  sudokuState.selected = null;
  els.sudokuFeedback.textContent = "时间到，棋盘已锁定";
  els.sudokuFeedback.dataset.tone = "try";
  sound.play("wrong");
}

function updateSudokuClock() {
  if (sudokuState.elapsedStartedAt !== null) {
    els.sudokuElapsed.textContent = formatClock((Date.now() - sudokuState.elapsedStartedAt) / 1000);
  }

  if (sudokuState.countdownActive && sudokuState.countdownEndsAt !== null) {
    const remainingSeconds = Math.ceil((sudokuState.countdownEndsAt - Date.now()) / 1000);
    els.sudokuCountdown.textContent = formatClock(remainingSeconds);
    if (remainingSeconds <= 0) {
      els.sudokuCountdown.textContent = "00:00";
      lockSudokuAfterCountdown();
    }
  } else if (!sudokuState.locked) {
    els.sudokuCountdown.textContent = "--:--";
  }

  renderSudoku();
}

function startSudokuCountdown() {
  sudokuState.countdownActive = true;
  sudokuState.locked = false;
  sudokuState.countdownEndsAt = Date.now() + sudokuState.countdownMinutes * 60 * 1000;
  els.sudokuFeedback.textContent = "倒计时挑战开始";
  els.sudokuFeedback.dataset.tone = "good";
  sound.play("level");
  updateSudokuClock();
}

function selectSudokuCell(row, col) {
  if (sudokuState.locked) return;
  if (sudokuState.game.givens.has(cellKey(row, col))) return;
  sudokuState.selected = { row, col };
  sound.play("tap");
  renderSudoku();
}

function setSudokuValue(value) {
  if (sudokuState.locked) return;
  if (!sudokuState.selected) return;
  const { row, col } = sudokuState.selected;
  if (sudokuState.game.givens.has(cellKey(row, col))) return;

  if (sudokuState.noteMode && value > 0) {
    const notes = sudokuState.notes[row][col];
    if (sudokuState.game.entries[row][col]) {
      els.sudokuFeedback.textContent = "已有正式数字，先清空再记录候选";
      els.sudokuFeedback.dataset.tone = "try";
      sound.play("wrong");
    } else if (notes.includes(value)) {
      sudokuState.notes[row][col] = notes.filter((note) => note !== value);
      els.sudokuFeedback.textContent = "候选数已取消";
      els.sudokuFeedback.dataset.tone = "neutral";
      sound.play("tap");
    } else if (notes.length >= 2) {
      els.sudokuFeedback.textContent = "每个格子最多记录两个候选数";
      els.sudokuFeedback.dataset.tone = "try";
      sound.play("wrong");
    } else {
      sudokuState.notes[row][col] = [...notes, value].sort((left, right) => left - right);
      els.sudokuFeedback.textContent = "候选数已记录";
      els.sudokuFeedback.dataset.tone = "good";
      sound.play("tap");
    }
    renderSudoku();
    return;
  }

  sudokuState.game.entries[row][col] = value;
  sudokuState.notes[row][col] = [];
  const conflicts = findConflicts(sudokuState.game.entries, sudokuState.game.givens, sudokuState.game);

  if (isSolved(sudokuState.game.entries, sudokuState.game.solution, sudokuState.game.givens, sudokuState.game)) {
    els.sudokuFeedback.textContent = "数独完成啦";
    els.sudokuFeedback.dataset.tone = "good";
    sound.play("finish");
  } else if (conflicts.size > 0) {
    els.sudokuFeedback.textContent = "有重复数字，换个格子试试";
    els.sudokuFeedback.dataset.tone = "try";
    sound.play("wrong");
  } else {
    els.sudokuFeedback.textContent = "继续推理";
    els.sudokuFeedback.dataset.tone = "good";
    sound.play("correct");
  }

  renderSudoku();
}

function resetSudokuGame() {
  if (sudokuState.locked) return;
  sudokuState.game.entries = sudokuState.game.puzzle.map((row) => [...row]);
  sudokuState.notes = createSudokuNotes(sudokuState.game.size);
  sudokuState.selected = null;
  els.sudokuFeedback.textContent = "先点空格，再选择数字";
  els.sudokuFeedback.dataset.tone = "neutral";
  renderSudoku();
}

function createCurrentSudokuGame() {
  return createSudokuGame({
    size: sudokuState.size,
    difficulty: sudokuState.difficulty,
  });
}

function setSudokuDifficulty(difficulty) {
  sudokuState.difficulty = difficulty;
  sudokuState.game = createCurrentSudokuGame();
  sudokuState.notes = createSudokuNotes(sudokuState.game.size);
  sudokuState.selected = null;
  if (!canUseSudokuNotes()) sudokuState.noteMode = false;
  startSudokuClock({ resetCountdown: true });
  const labels = { simple: "简单题来了", normal: "普通题来了", challenge: "挑战题来了" };
  els.sudokuFeedback.textContent = labels[difficulty] || "新题来了";
  els.sudokuFeedback.dataset.tone = "neutral";
  renderSudoku();
}

function setSudokuSize(size) {
  sudokuState.size = size;
  sudokuState.game = createCurrentSudokuGame();
  sudokuState.notes = createSudokuNotes(sudokuState.game.size);
  sudokuState.selected = null;
  if (!canUseSudokuNotes()) sudokuState.noteMode = false;
  startSudokuClock({ resetCountdown: true });
  els.sudokuFeedback.textContent = size === 9 ? "九宫格来了" : "六宫格来了";
  els.sudokuFeedback.dataset.tone = "neutral";
  renderSudoku();
}

function nextSudokuGame() {
  sudokuState.game = createCurrentSudokuGame();
  sudokuState.notes = createSudokuNotes(sudokuState.game.size);
  sudokuState.selected = null;
  startSudokuClock({ resetCountdown: true });
  els.sudokuFeedback.textContent = "新题来了";
  els.sudokuFeedback.dataset.tone = "good";
  sound.play("level");
  renderSudoku();
}

function canUseSudokuNotes() {
  return sudokuState.size === 9 && sudokuState.difficulty === "challenge";
}

function toggleSudokuNotes() {
  if (!canUseSudokuNotes()) return;
  sudokuState.noteMode = !sudokuState.noteMode;
  els.sudokuFeedback.textContent = sudokuState.noteMode ? "候选数模式已开启" : "候选数模式已关闭";
  els.sudokuFeedback.dataset.tone = "neutral";
  sound.play("tap");
  renderSudoku();
}

function renderSudoku() {
  const { game } = sudokuState;
  const conflicts = findConflicts(game.entries, game.givens, game);
  els.sudokuGrid.innerHTML = "";
  els.sudokuGrid.style.gridTemplateColumns = `repeat(${game.size}, 1fr)`;
  els.sudokuGrid.style.gridTemplateRows = `repeat(${game.size}, 1fr)`;
  els.sudokuGrid.dataset.size = String(game.size);

  for (let row = 0; row < game.size; row += 1) {
    for (let col = 0; col < game.size; col += 1) {
      const button = document.createElement("button");
      const key = cellKey(row, col);
      const value = game.entries[row][col];
      const notes = sudokuState.notes[row]?.[col] || [];
      button.type = "button";
      button.className = "sudoku-cell";
      button.textContent = value ? String(value) : "";
      if (!value && notes.length > 0) {
        const noteText = document.createElement("span");
        noteText.className = "sudoku-notes";
        noteText.textContent = notes.join(" ");
        button.append(noteText);
      }
      button.dataset.row = String(row);
      button.dataset.col = String(col);
      button.dataset.notes = value ? "" : notes.join(",");
      button.dataset.given = String(game.givens.has(key));
      button.dataset.conflict = String(conflicts.has(key));
      button.dataset.selected = String(sudokuState.selected?.row === row && sudokuState.selected?.col === col);
      button.dataset.boxRight = String((col + 1) % game.boxCols === 0 && col < game.size - 1);
      button.dataset.boxBottom = String((row + 1) % game.boxRows === 0 && row < game.size - 1);
      button.disabled = sudokuState.locked;
      button.addEventListener("click", () => selectSudokuCell(row, col));
      els.sudokuGrid.append(button);
    }
  }

  els.sudokuPad.innerHTML = "";
  els.sudokuPad.dataset.size = String(game.size);
  for (let value = 1; value <= game.size; value += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sudoku-key";
    button.textContent = String(value);
    button.disabled = sudokuState.locked;
    button.addEventListener("click", () => setSudokuValue(value));
    els.sudokuPad.append(button);
  }
  const clear = document.createElement("button");
  clear.type = "button";
  clear.className = "sudoku-key sudoku-clear";
  clear.textContent = "清空格";
  clear.disabled = sudokuState.locked;
  clear.addEventListener("click", () => setSudokuValue(0));
  els.sudokuPad.append(clear);

  els.sudokuStatus.textContent = conflicts.size > 0 ? "检查" : "推理";
  els.sudokuRule.textContent = game.size === 9
    ? "每行、每列、每个 3x3 宫格都要出现 1 到 9。"
    : "每行、每列、每个 2x3 宫格都要出现 1 到 6。";
  els.sudokuGrid.setAttribute("aria-label", `1到${game.size}数独棋盘`);
  els.sudokuSize6.dataset.active = String(sudokuState.size === 6);
  els.sudokuSize9.dataset.active = String(sudokuState.size === 9);
  els.sudokuSimple.dataset.active = String(sudokuState.difficulty === "simple");
  els.sudokuNormal.dataset.active = String(sudokuState.difficulty === "normal");
  els.sudokuChallenge.dataset.active = String(sudokuState.difficulty === "challenge");
  els.sudokuNotes.hidden = !canUseSudokuNotes();
  els.sudokuNotes.dataset.active = String(sudokuState.noteMode && canUseSudokuNotes());
  els.sudokuNotes.setAttribute("aria-pressed", String(sudokuState.noteMode && canUseSudokuNotes()));
  els.sudokuNotes.disabled = sudokuState.locked;
  els.resetSudoku.disabled = sudokuState.locked;
  els.sudokuMinutes.disabled = sudokuState.countdownActive || sudokuState.locked;
  els.startSudokuCountdown.disabled = sudokuState.countdownActive || sudokuState.locked;
  updateSudokuMinutesLabel();
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

els.openMath.addEventListener("click", () => showMathMenu());
els.openEnglish.addEventListener("click", () => showEnglishMenu());
els.backFromMathMenu.addEventListener("click", () => showLobby());
els.openArithmetic.addEventListener("click", () => startMath("practice"));
els.openSudoku.addEventListener("click", () => openSudokuGame());
els.backFromArithmetic.addEventListener("click", () => showMathMenu());
els.backFromSudoku.addEventListener("click", () => showMathMenu());
els.backFromEnglishMenu.addEventListener("click", () => showLobby());
els.openWordGame.addEventListener("click", () => startEnglish("word"));
els.openSentenceGame.addEventListener("click", () => startEnglish("sentence"));
els.backFromEnglishPractice.addEventListener("click", () => showEnglishMenu());
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
els.startEnglish.addEventListener("click", () => startEnglish(englishState.mode));
els.speakWord.addEventListener("click", () => {
  sound.play("tap");
  speakCurrentWord();
});
els.toggleSoundEnglish.addEventListener("click", () => {
  const enabled = sound.toggle();
  if (enabled) sound.play("tap");
  renderEnglish();
});
els.resetEnglish.addEventListener("click", () => {
  if (englishState.mode === "sentence") {
    englishState.sentenceLevelIndex = 0;
  } else {
    englishState.wordLevelIndex = 0;
  }
  saveEnglishProgress();
  startEnglish(englishState.mode);
});
els.newSudoku.addEventListener("click", () => nextSudokuGame());
els.resetSudoku.addEventListener("click", () => resetSudokuGame());
els.sudokuSize6.addEventListener("click", () => setSudokuSize(6));
els.sudokuSize9.addEventListener("click", () => setSudokuSize(9));
els.sudokuSimple.addEventListener("click", () => setSudokuDifficulty("simple"));
els.sudokuNormal.addEventListener("click", () => setSudokuDifficulty("normal"));
els.sudokuChallenge.addEventListener("click", () => setSudokuDifficulty("challenge"));
els.sudokuNotes.addEventListener("click", () => toggleSudokuNotes());
els.sudokuMinutes.addEventListener("input", () => {
  sudokuState.countdownMinutes = Number(els.sudokuMinutes.value);
  updateSudokuMinutesLabel();
});
els.startSudokuCountdown.addEventListener("click", () => startSudokuCountdown());

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
loadEnglishProgress();
buildKeypad();
showLobby();
