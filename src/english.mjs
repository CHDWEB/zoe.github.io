const WORD_GROUPS = {
  colors: [
    ["red", "红色"], ["blue", "蓝色"], ["green", "绿色"], ["yellow", "黄色"],
    ["black", "黑色"], ["white", "白色"], ["pink", "粉色"], ["purple", "紫色"],
    ["brown", "棕色"], ["orange", "橙色"],
  ],
  clothes: [
    ["shirt", "衬衫"], ["coat", "外套"], ["dress", "连衣裙"], ["skirt", "短裙"],
    ["shoes", "鞋子"], ["hat", "帽子"], ["socks", "袜子"], ["pants", "裤子"],
    ["gloves", "手套"], ["scarf", "围巾"], ["boots", "靴子"], ["sweater", "毛衣"],
    ["T-shirt", "T恤"],
  ],
  stationery: [
    ["book", "书"], ["pen", "钢笔"], ["pencil", "铅笔"], ["ruler", "尺子"],
    ["bag", "书包"], ["eraser", "橡皮"], ["desk", "书桌"], ["chair", "椅子"],
    ["glue", "胶水"], ["pencil case", "铅笔盒"], ["crayons", "蜡笔"],
    ["blackboard", "黑板"], ["scissors", "剪刀"],
  ],
  months: [
    ["January", "一月"], ["February", "二月"], ["March", "三月"], ["April", "四月"],
    ["May", "五月"], ["June", "六月"], ["July", "七月"], ["August", "八月"],
    ["September", "九月"], ["October", "十月"], ["November", "十一月"], ["December", "十二月"],
  ],
  sports: [
    ["run", "跑步"], ["swim", "游泳"], ["jump", "跳跃"], ["dance", "跳舞"],
    ["skate", "滑冰"], ["ski", "滑雪"], ["ride", "骑车"], ["climb", "攀爬"],
    ["rock climbing", "攀岩"], ["baseball", "棒球"], ["soccer", "足球"],
    ["table tennis", "乒乓球"],
  ],
  balls: [
    ["football", "足球"], ["basketball", "篮球"], ["baseball", "棒球"], ["volleyball", "排球"],
    ["tennis", "网球"], ["table tennis", "乒乓球"], ["badminton", "羽毛球"], ["golf", "高尔夫"],
  ],
  seasons: [
    ["spring", "春天"], ["summer", "夏天"], ["autumn", "秋天"], ["winter", "冬天"],
    ["season", "季节"], ["warm", "温暖的"], ["hot", "炎热的"], ["cold", "寒冷的"],
  ],
  weather: [
    ["sunny", "晴朗的"], ["rainy", "下雨的"], ["cloudy", "多云的"], ["windy", "有风的"],
    ["snowy", "下雪的"], ["stormy", "暴风雨的"], ["foggy", "有雾的"], ["weather", "天气"],
  ],
  animals: [
    ["cat", "猫"], ["dog", "狗"], ["bird", "鸟"], ["fish", "鱼"],
    ["rabbit", "兔子"], ["tiger", "老虎"], ["lion", "狮子"], ["monkey", "猴子"],
    ["giraffe", "长颈鹿"], ["crocodile", "鳄鱼"], ["zebra", "斑马"],
    ["dinosaur", "恐龙"], ["duck", "鸭子"], ["pig", "猪"], ["cow", "牛"],
    ["sheep", "绵羊"],
  ],
};

export const WORD_LEVELS = [
  { id: "word-colors", title: "颜色单词", description: "认识常见颜色。", words: WORD_GROUPS.colors, goalCorrect: 8 },
  { id: "word-clothes", title: "服饰单词", description: "练习衣服和穿戴。", words: WORD_GROUPS.clothes, goalCorrect: 8 },
  { id: "word-stationery", title: "文具单词", description: "学习用品看一看。", words: WORD_GROUPS.stationery, goalCorrect: 8 },
  { id: "word-months", title: "月份单词", description: "十二个月份慢慢熟。", words: WORD_GROUPS.months, goalCorrect: 8 },
  { id: "word-sports", title: "运动单词", description: "跑跳游骑都认识。", words: WORD_GROUPS.sports, goalCorrect: 8 },
  { id: "word-balls", title: "球类单词", description: "各种球类集中练。", words: WORD_GROUPS.balls, goalCorrect: 8 },
  { id: "word-seasons", title: "季节单词", description: "春夏秋冬和冷热。", words: WORD_GROUPS.seasons, goalCorrect: 8 },
  { id: "word-weather", title: "天气单词", description: "晴雨风雪都来啦。", words: WORD_GROUPS.weather, goalCorrect: 8 },
  { id: "word-animals", title: "动物单词", description: "常见动物再巩固。", words: WORD_GROUPS.animals, goalCorrect: 8 },
  {
    id: "word-mixed",
    title: "单词混合挑战",
    description: "所有分类随机出现。",
    words: Object.values(WORD_GROUPS).flat(),
    goalCorrect: 12,
  },
];

const SUBJECTS = [
  { subject: "I", thirdPerson: false },
  { subject: "You", thirdPerson: false },
  { subject: "We", thirdPerson: false },
  { subject: "They", thirdPerson: false },
  { subject: "He", thirdPerson: true },
  { subject: "She", thirdPerson: true },
  { subject: "It", thirdPerson: true },
];

const OBJECTS = ["apples", "cats", "football", "rainy days", "music", "tennis", "winter", "books"];
const VERBS = {
  like: { base: "like", third: "likes" },
  love: { base: "love", third: "loves" },
  hate: { base: "hate", third: "hates" },
};

export const SENTENCE_LEVELS = [
  { id: "sentence-like", title: "like / likes", description: "看人称，选 like 还是 likes。", type: "verb", verbs: ["like"], goalCorrect: 8 },
  { id: "sentence-love", title: "love / loves", description: "练习 love 和 loves。", type: "verb", verbs: ["love"], goalCorrect: 8 },
  { id: "sentence-hate", title: "hate / hates", description: "练习 hate 和 hates。", type: "verb", verbs: ["hate"], goalCorrect: 8 },
  { id: "sentence-helper-mixed", title: "do / does 混合", description: "区分 do、don't、does、doesn't。", type: "helper", verbs: ["like", "love", "hate"], goalCorrect: 12 },
];

function pickIndex(length, random = Math.random) {
  return Math.floor(random() * length);
}

function pick(items, random = Math.random) {
  return items[pickIndex(items.length, random)];
}

function shuffle(items, random = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = pickIndex(i + 1, random);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function cloneWordLevel(level) {
  return {
    ...level,
    words: level.words.map(([word, translation]) => [word, translation]),
  };
}

export function createWordPlan() {
  return WORD_LEVELS.map(cloneWordLevel);
}

export function createWordQuestion(level, random = Math.random, usedWords = new Set()) {
  const availableWords = level.words.length > level.goalCorrect
    ? level.words.filter(([word]) => !usedWords.has(word))
    : level.words;
  const sourceWords = availableWords.length > 0 ? availableWords : level.words;
  const [word, translation] = sourceWords[pickIndex(sourceWords.length, random)];
  const allTranslations = Object.values(WORD_GROUPS).flat().map((entry) => entry[1]);
  const localTranslations = level.words.map((entry) => entry[1]);
  const distractorPool = shuffle([...new Set([...localTranslations, ...allTranslations])]
    .filter((item) => item !== translation), random);

  return {
    mode: "word",
    word,
    translation,
    prompt: word,
    fullSentence: word,
    speakText: word,
    answer: translation,
    options: shuffle([translation, ...distractorPool.slice(0, 2)], random),
  };
}

export function createSentencePlan() {
  return SENTENCE_LEVELS.map((level) => ({ ...level, verbs: [...level.verbs] }));
}

function createVerbQuestion(level, random) {
  const subject = pick(SUBJECTS, random);
  const verbKey = pick(level.verbs, random);
  const object = pick(OBJECTS, random);
  const verb = VERBS[verbKey];
  const answer = subject.thirdPerson ? verb.third : verb.base;
  const prompt = `${subject.subject} ___ ${object}.`;
  const wrongVerb = subject.thirdPerson ? verb.base : verb.third;

  return {
    mode: "sentence",
    prompt,
    fullSentence: `${subject.subject} ${answer} ${object}.`,
    speakText: `${subject.subject} ${answer} ${object}.`,
    answer,
    options: shuffle([answer, wrongVerb], random),
  };
}

function createHelperQuestion(level, random) {
  const subject = pick(SUBJECTS, random);
  const verbKey = pick(level.verbs, random);
  const object = pick(OBJECTS, random);
  const helperChoices = subject.thirdPerson ? ["does", "doesn't"] : ["do", "don't"];
  const answer = pick(helperChoices, random);
  const prompt = `${subject.subject} ___ ${VERBS[verbKey].base} ${object}.`;
  const wrongSameMeaning = subject.thirdPerson
    ? (answer === "does" ? "do" : "don't")
    : (answer === "do" ? "does" : "doesn't");

  return {
    mode: "sentence",
    prompt,
    fullSentence: `${subject.subject} ${answer} ${VERBS[verbKey].base} ${object}.`,
    speakText: `${subject.subject} ${answer} ${VERBS[verbKey].base} ${object}.`,
    answer,
    options: shuffle([answer, wrongSameMeaning], random),
  };
}

export function createSentenceQuestion(level, random = Math.random) {
  return level.type === "helper"
    ? createHelperQuestion(level, random)
    : createVerbQuestion(level, random);
}

export function createEnglishPlan() {
  return createWordPlan();
}

export function createEnglishQuestion(level, random = Math.random) {
  return createWordQuestion(level, random);
}
