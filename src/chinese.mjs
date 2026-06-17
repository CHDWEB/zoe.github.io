const CHARACTER_GROUPS = {
  nature: [
    { char: "日", pinyin: "ri", words: ["日子", "日月", "生日"] },
    { char: "月", pinyin: "yue", words: ["月亮", "月牙", "日月"] },
    { char: "山", pinyin: "shan", words: ["大山", "小山", "山水"] },
    { char: "水", pinyin: "shui", words: ["喝水", "水果", "山水"] },
    { char: "火", pinyin: "huo", words: ["火山", "大火", "火苗"] },
    { char: "田", pinyin: "tian", words: ["田地", "水田", "田里"] },
    { char: "木", pinyin: "mu", words: ["木头", "木马", "树木"] },
    { char: "云", pinyin: "yun", words: ["白云", "云朵", "云彩"] },
  ],
  people: [
    { char: "人", pinyin: "ren", words: ["大人", "小人", "人们"] },
    { char: "口", pinyin: "kou", words: ["人口", "门口", "口水"] },
    { char: "手", pinyin: "shou", words: ["小手", "手心", "手工"] },
    { char: "目", pinyin: "mu", words: ["目光", "耳目", "题目"] },
    { char: "耳", pinyin: "er", words: ["耳朵", "木耳", "耳目"] },
    { char: "爸", pinyin: "ba", words: ["爸爸", "爸妈", "老爸"] },
    { char: "妈", pinyin: "ma", words: ["妈妈", "爸妈", "姑妈"] },
    { char: "我", pinyin: "wo", words: ["我们", "我的", "自我"] },
  ],
  school: [
    { char: "书", pinyin: "shu", words: ["书本", "看书", "书包"] },
    { char: "本", pinyin: "ben", words: ["本子", "书本", "课本"] },
    { char: "笔", pinyin: "bi", words: ["铅笔", "毛笔", "笔画"] },
    { char: "尺", pinyin: "chi", words: ["尺子", "直尺", "米尺"] },
    { char: "学", pinyin: "xue", words: ["上学", "学习", "学校"] },
    { char: "校", pinyin: "xiao", words: ["学校", "校门", "校园"] },
    { char: "文", pinyin: "wen", words: ["语文", "文字", "中文"] },
    { char: "字", pinyin: "zi", words: ["生字", "写字", "汉字"] },
  ],
  animals: [
    { char: "牛", pinyin: "niu", words: ["小牛", "水牛", "牛奶"] },
    { char: "羊", pinyin: "yang", words: ["小羊", "山羊", "羊毛"] },
    { char: "鸟", pinyin: "niao", words: ["小鸟", "飞鸟", "鸟儿"] },
    { char: "鱼", pinyin: "yu", words: ["小鱼", "金鱼", "鱼儿"] },
    { char: "虫", pinyin: "chong", words: ["小虫", "虫子", "飞虫"] },
    { char: "马", pinyin: "ma", words: ["小马", "木马", "马儿"] },
  ],
  life: [
    { char: "大", pinyin: "da", words: ["大人", "大山", "大门"] },
    { char: "小", pinyin: "xiao", words: ["小手", "小鸟", "小鱼"] },
    { char: "上", pinyin: "shang", words: ["上学", "上山", "天上"] },
    { char: "下", pinyin: "xia", words: ["下雨", "下来", "地下"] },
    { char: "来", pinyin: "lai", words: ["回来", "上来", "来去"] },
    { char: "去", pinyin: "qu", words: ["出去", "来去", "去年"] },
  ],
};

const CHARACTER_LEVELS = [
  { id: "char-nature", title: "自然生字", description: "日月山水，认一认读音。", items: CHARACTER_GROUPS.nature, goalCorrect: 8 },
  { id: "char-people", title: "人物身体", description: "人、口、手、目、耳。", items: CHARACTER_GROUPS.people, goalCorrect: 8 },
  { id: "char-school", title: "学校生字", description: "书本笔尺，学习常用字。", items: CHARACTER_GROUPS.school, goalCorrect: 8 },
  { id: "char-animals", title: "动物生字", description: "牛羊鸟鱼虫马。", items: CHARACTER_GROUPS.animals, goalCorrect: 6 },
  { id: "char-life", title: "生活生字", description: "大小上下，生活里常见。", items: CHARACTER_GROUPS.life, goalCorrect: 6 },
];

const WORD_LEVELS = CHARACTER_LEVELS.map((level) => ({
  ...level,
  id: level.id.replace("char-", "word-"),
  title: level.title.replace("生字", "组词"),
  description: "看一个生字，选择可以组成的词语。",
  words: level.items.flatMap((item) => item.words.map((word) => ({ char: item.char, word }))),
}));

const SENTENCE_LEVELS = [
  {
    id: "sentence-nature",
    title: "自然句子",
    description: "把词语放进简单句子里。",
    goalCorrect: 6,
    items: [
      { prompt: "天上有一朵____。", answer: "白云", wrong: "小鱼" },
      { prompt: "我爱看____。", answer: "月亮", wrong: "尺子" },
      { prompt: "山下有____。", answer: "水田", wrong: "耳朵" },
      { prompt: "远处有一座____。", answer: "大山", wrong: "小手" },
    ],
  },
  {
    id: "sentence-school",
    title: "学校句子",
    description: "读一读，选出通顺的词。",
    goalCorrect: 6,
    items: [
      { prompt: "我在学校____。", answer: "学习", wrong: "下雨" },
      { prompt: "妹妹拿着____写字。", answer: "铅笔", wrong: "山羊" },
      { prompt: "语文课上认____。", answer: "生字", wrong: "金鱼" },
      { prompt: "我的____在书包里。", answer: "课本", wrong: "火山" },
    ],
  },
  {
    id: "sentence-life",
    title: "生活句子",
    description: "判断词语和句子是否搭配。",
    goalCorrect: 6,
    items: [
      { prompt: "小鸟在天上____。", answer: "飞", wrong: "写字" },
      { prompt: "小鱼在水里____。", answer: "游", wrong: "上学" },
      { prompt: "我和妈妈____。", answer: "回家", wrong: "木头" },
      { prompt: "小羊在山上____。", answer: "吃草", wrong: "看书" },
    ],
  },
];

const PINYIN_TONES = {
  ri: "rì",
  yue: "yuè",
  shan: "shān",
  shui: "shuǐ",
  huo: "huǒ",
  tian: "tián",
  mu: "mù",
  yun: "yún",
  ren: "rén",
  kou: "kǒu",
  shou: "shǒu",
  er: "ěr",
  ba: "bà",
  ma: "mā",
  wo: "wǒ",
  shu: "shū",
  ben: "běn",
  bi: "bǐ",
  chi: "chǐ",
  xue: "xué",
  xiao: "xiào",
  wen: "wén",
  zi: "zì",
  niu: "niú",
  yang: "yáng",
  niao: "niǎo",
  yu: "yú",
  chong: "chóng",
  da: "dà",
  shang: "shàng",
  xia: "xià",
  lai: "lái",
  qu: "qù",
};

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

function cloneCharacterLevel(level) {
  return {
    ...level,
    items: level.items.map((item) => ({ ...item, words: [...item.words] })),
  };
}

function cloneWordLevel(level) {
  return {
    ...level,
    words: level.words.map((item) => ({ ...item })),
  };
}

function cloneSentenceLevel(level) {
  return {
    ...level,
    items: level.items.map((item) => ({ ...item })),
  };
}

export function createCharacterPlan() {
  return CHARACTER_LEVELS.map(cloneCharacterLevel);
}

export function createWordPlan() {
  return WORD_LEVELS.map(cloneWordLevel);
}

export function createSentencePlan() {
  return SENTENCE_LEVELS.map(cloneSentenceLevel);
}

function createCharacterQuestion(level, random) {
  const item = pick(level.items, random);
  const answer = PINYIN_TONES[item.pinyin] || item.pinyin;
  const pinyinPool = Object.values(CHARACTER_GROUPS)
    .flat()
    .map((entry) => PINYIN_TONES[entry.pinyin] || entry.pinyin)
    .filter((pinyin) => pinyin !== answer);
  const options = shuffle([answer, ...shuffle([...new Set(pinyinPool)], random).slice(0, 2)], random);
  return {
    mode: "character",
    prompt: item.char,
    fullSentence: `${item.char} 读 ${answer}`,
    answer,
    options,
  };
}

function createWordQuestion(level, random) {
  const uniqueWords = [...new Map(level.words
    .filter((entry) => Array.from(entry.word).length === 2)
    .map((entry) => [entry.word, entry])).values()];
  const pairs = shuffle(uniqueWords, random).slice(0, 4).map((entry) => {
    const [top, bottom] = Array.from(entry.word);
    return { top, bottom, word: entry.word };
  });
  return {
    mode: "word-match",
    prompt: "上下配一配",
    fullSentence: pairs.map((pair) => pair.word).join("，"),
    answer: pairs[0]?.word || "",
    pairs,
    topOptions: shuffle(pairs.map((pair) => ({ char: pair.top, word: pair.word })), random),
    bottomOptions: shuffle(pairs.map((pair) => ({ char: pair.bottom, word: pair.word })), random),
    options: [],
  };
}

function createSentenceQuestion(level, random) {
  const item = pick(level.items, random);
  return {
    mode: "sentence",
    prompt: item.prompt,
    fullSentence: item.prompt.replace("____", item.answer),
    answer: item.answer,
    options: shuffle([item.answer, item.wrong], random),
  };
}

export function createChineseQuestion(level, random = Math.random) {
  if (level.id.startsWith("char-")) return createCharacterQuestion(level, random);
  if (level.id.startsWith("word-")) return createWordQuestion(level, random);
  return createSentenceQuestion(level, random);
}
