const LESSON_ROWS = [
  ["识字一 1", "霜吹落降飘游池入", "shuāng chuī luò jiàng piāo yóu chí rù", "秋霜 吹风 落下 下降 飘雪 游泳 水池 入口"],
  ["识字一 2", "姓氏李张古吴赵钱孙周王官", "xìng shì lǐ zhāng gǔ wú zhào qián sūn zhōu wáng guān", "姓名 姓氏 李子 张开 古代 吴国 赵国 钱包 孙子 周围 王子 长官"],
  ["识字一 3", "清晴眼睛保护害事情况让病", "qīng qíng yǎn jīng bǎo hù hài shì qíng kuàng ràng bìng", "清水 晴天 眼睛 眼睛 保护 保护 害怕 事情 情况 情况 让开 生病"],
  ["识字一 4", "相遇喜欢怕言互令动万纯净", "xiāng yù xǐ huān pà yán hù lìng dòng wàn chún jìng", "相遇 遇见 喜欢 欢乐 害怕 语言 互相 口令 运动 万一 纯净 干净"],
  ["语文园地一", "阴雷电阵冰冻夹", "yīn léi diàn zhèn bīng dòng jiā", "阴天 雷声 电话 一阵 冰雪 冰冻 夹子"],
  ["课文 1", "吃忘井村叫毛主席乡亲战士面", "chī wàng jǐng cūn jiào máo zhǔ xí xiāng qīn zhàn shì miàn", "吃饭 忘记 水井 村子 叫声 毛笔 主人 席子 家乡 亲人 战士 士兵 面条"],
  ["课文 2", "想告诉京安门广非常壮观", "xiǎng gào sù jīng ān mén guǎng fēi cháng zhuàng guān", "想念 告诉 告诉 北京 平安 大门 广场 非常 常常 壮观 观看"],
  ["课文 3", "接觉再做各种样伙伴却也趣这", "jiē jiào zài zuò gè zhǒng yàng huǒ bàn què yě qù zhè", "接着 睡觉 再见 做事 各自 种子 样子 伙伴 伙伴 冷却 也许 有趣 这里"],
  ["课文 4", "太阳道送忙尝香甜温暖该颜因", "tài yáng dào sòng máng cháng xiāng tián wēn nuǎn gāi yán yīn", "太阳 阳光 道路 送给 帮忙 品尝 香气 甜美 温暖 暖和 应该 颜色 因为"],
  ["语文园地二", "辆匹册支铅棵架", "liàng pǐ cè zhī qiān kē jià", "车辆 一匹 画册 一支 铅笔 一棵 书架"],
  ["课文 5", "块捉急直河行死信跟忽喊身", "kuài zhuō jí zhí hé xíng sǐ xìn gēn hū hǎn shēn", "一块 捉虫 着急 一直 小河 行走 生死 写信 跟着 忽然 喊叫 身体"],
  ["课文 6", "只窝孤单种都邻居招呼静乐", "zhǐ wō gū dān zhòng dōu lín jū zhāo hū jìng lè", "一只 鸟窝 孤单 单独 种树 都是 邻居 居住 招手 招呼 安静 快乐"],
  ["课文 7", "怎独跳绳讲得羽球戏排篮连运", "zěn dú tiào shéng jiǎng dé yǔ qiú xì pái lán lián yùn", "怎么 单独 跳绳 绳子 讲话 得到 羽毛 足球 游戏 排队 篮球 连忙 运动"],
  ["课文 8", "夜思床光疑举望低故", "yè sī chuáng guāng yí jǔ wàng dī gù", "夜晚 思念 木床 月光 怀疑 举手 看望 低头 故乡"],
  ["课文 9", "胆敢往外勇窗乱偏散原像微", "dǎn gǎn wǎng wài yǒng chuāng luàn piān sàn yuán xiàng wēi", "胆子 勇敢 往外 外面 勇气 窗户 乱跑 偏旁 散步 原来 好像 微笑"],
  ["课文 10", "端粽节总米间分豆肉带知据念", "duān zòng jié zǒng mǐ jiān fēn dòu ròu dài zhī jù niàn", "端正 粽子 节日 总是 大米 中间 分开 豆子 牛肉 带领 知道 根据 想念"],
  ["课文 11", "虹座浇提洒挑兴镜拿照千裙", "hóng zuò jiāo tí sǎ tiāo xìng jìng ná zhào qiān qún", "彩虹 一座 浇水 提问 洒水 挑选 高兴 镜子 拿走 照片 千万 裙子"],
  ["语文园地四", "眉鼻嘴脖臂肚腿脚", "méi bí zuǐ bó bì dù tuǐ jiǎo", "眉毛 鼻子 嘴巴 脖子 手臂 肚子 大腿 双脚"],
  ["识字二 5", "蜻蜓迷藏造蚂蚁食粮蜘蛛网", "qīng tíng mí cáng zào mǎ yǐ shí liáng zhī zhū wǎng", "蜻蜓 蜻蜓 迷路 躲藏 建造 蚂蚁 蚂蚁 食物 粮食 蜘蛛 蜘蛛 蛛网"],
  ["识字二 6", "圆严寒酷暑凉晨细朝霞夕杨", "yuán yán hán kù shǔ liáng chén xì zhāo xiá xī yáng", "圆形 严格 寒冷 酷暑 暑假 凉快 早晨 仔细 朝霞 彩霞 夕阳 杨树"],
  ["识字二 7", "操场拔拍跑踢铃热闹锻炼体", "cāo chǎng bá pāi pǎo tī líng rè nào duàn liàn tǐ", "早操 操场 拔河 拍球 跑步 踢球 铃声 热闹 热闹 锻炼 锻炼 身体"],
  ["识字二 8", "之初性善习教迁贵专幼玉器义", "zhī chū xìng shàn xí jiào qiān guì zhuān yòu yù qì yì", "之前 当初 性格 善良 学习 教师 迁移 贵重 专心 幼小 玉石 乐器 意义"],
  ["语文园地五", "饭能饱茶泡轻鞭炮", "fàn néng bǎo chá pào qīng biān pào", "米饭 能力 吃饱 喝茶 泡茶 轻声 鞭炮 炮火"],
  ["课文 12", "首踪迹浮萍泉流爱柔荷露角", "shǒu zōng jì fú píng quán liú ài róu hé lù jiǎo", "首先 踪迹 足迹 浮动 浮萍 泉水 流水 爱心 温柔 荷花 露珠 角落"],
  ["课文 13", "珠摇躺晶停机展透翅膀唱朵", "zhū yáo tǎng jīng tíng jī zhǎn tòu chì bǎng chàng duǒ", "珍珠 摇动 躺下 水晶 停止 飞机 展开 透明 翅膀 翅膀 唱歌 花朵"],
  ["课文 14", "腰坡沉伸潮湿呢空闷消息搬响", "yāo pō chén shēn cháo shī ne kōng mèn xiāo xī bān xiǎng", "弯腰 山坡 下沉 伸手 潮湿 湿气 好呢 空气 闷热 消息 消息 搬家 响声"],
  ["语文园地六", "棍汤扇椅萤牵织斗", "gùn tāng shàn yǐ yíng qiān zhī dǒu", "木棍 米汤 扇子 椅子 萤火 牵手 织布 北斗"],
  ["课文 15", "具次丢哪新每平她些仔检查所", "jù cì diū nǎ xīn měi píng tā xiē zǎi jiǎn chá suǒ", "文具 一次 丢失 哪里 新年 每天 平安 她们 一些 仔细 检查 检查 所以"],
  ["课文 16", "钟丁元迟洗背刚共汽决定已经", "zhōng dīng yuán chí xǐ bèi gāng gòng qì jué dìng yǐ jīng", "时钟 园丁 元旦 迟到 洗手 背包 刚才 一共 汽车 决定 决定 已经 已经"],
  ["课文 17", "物虎熊通注意遍百舌鬼脸准第", "wù hǔ xióng tōng zhù yì biàn bǎi shé guǐ liǎn zhǔn dì", "动物 老虎 熊猫 通过 注意 注意 一遍 百万 舌头 小鬼 笑脸 准备 第一"],
  ["课文 18", "猴结掰扛满扔摘捧瓜抱蹦追", "hóu jié bāi káng mǎn rēng zhāi pěng guā bào bèng zhuī", "猴子 结果 掰开 扛着 满意 扔掉 采摘 捧起 西瓜 拥抱 蹦跳 追赶"],
  ["语文园地七", "吵胖岁现票交弓甘", "chǎo pàng suì xiàn piào jiāo gōng gān", "吵闹 胖子 岁月 现在 车票 交通 弓箭 甘甜"],
  ["课文 19", "棉娘治燕别干然奇颗瓢碧吐啦", "mián niáng zhì yàn bié gān rán qí kē piáo bì tǔ la", "棉花 姑娘 治病 燕子 别人 树干 然后 奇怪 一颗 水瓢 碧绿 吐出 好啦"],
  ["课文 20", "咕咚熟掉吓羊鹿逃命象野拦领", "gū dōng shú diào xià yáng lù táo mìng xiàng yě lán lǐng", "咕咚 咕咚 熟人 掉下 吓人 山羊 小鹿 逃跑 生命 大象 田野 拦住 带领"],
  ["课文 21", "壁墙蚊咬断您拨甩赶房傻转", "bì qiáng wén yǎo duàn nín bō shuǎi gǎn fáng shǎ zhuǎn", "墙壁 墙角 蚊子 咬人 断开 您好 拨开 甩开 赶快 房子 傻笑 转身"],
  ["语文园地八", "卫刷梳巾擦皂澡盆", "wèi shuā shū jīn cā zào zǎo pén", "卫生 刷牙 梳头 毛巾 擦手 肥皂 洗澡 水盆"],
  ["常用偏旁", "原净冰单却欢观降都块场奇牵席张弯孤孩物新断转辆炼炮房扇忘想钱铅病端站裙初颜领甜乱粮赵赶跟跳躺霜雷", "yuán jìng bīng dān què huān guān jiàng dōu kuài chǎng qí qiān xí zhāng wān gū hái wù xīn duàn zhuǎn liàng liàn pào fáng shàn wàng xiǎng qián qiān bìng duān zhàn qún chū yán lǐng tián luàn liáng zhào gǎn gēn tiào tǎng shuāng léi", "原来 干净 冰雪 单独 冷却 欢乐 观看 降落 都是 一块 操场 奇怪 牵手 席子 张开 弯月 孤单 孩子 动物 新年 断开 转身 车辆 锻炼 鞭炮 房子 扇子 忘记 想念 钱包 铅笔 生病 端正 车站 裙子 当初 颜色 带领 甜美 乱跑 粮食 赵国 赶快 跟着 跳绳 躺下 秋霜 雷声"],
];

function parseLesson([title, charsText, pinyinText, wordsText], index) {
  const chars = Array.from(charsText);
  const pinyin = pinyinText.split(/\s+/);
  const words = wordsText.split(/\s+/);
  if (chars.length !== pinyin.length || chars.length !== words.length) {
    throw new Error(`Chinese lesson data mismatch: ${title}`);
  }
  return {
    id: `lesson-${index + 1}`,
    title,
    items: chars.map((char, itemIndex) => {
      const word = words[itemIndex];
      return {
        char,
        pinyin: pinyin[itemIndex],
        words: [word],
        sentence: `我会用“${word}”说一句话。`,
      };
    }),
  };
}

const LESSONS = LESSON_ROWS.map(parseLesson);

function splitLessons(chunkSize, mode) {
  return LESSONS.flatMap((lesson) => {
    const chunks = [];
    for (let start = 0; start < lesson.items.length; start += chunkSize) {
      chunks.push(lesson.items.slice(start, start + chunkSize));
    }
    return chunks.map((items, chunkIndex) => ({
      id: `${mode}-${lesson.id}-${chunkIndex + 1}`,
      title: chunks.length > 1 ? `${lesson.title} ${chunkIndex + 1}` : lesson.title,
      items,
    }));
  });
}

function pickIndex(length, random = Math.random) {
  return Math.floor(random() * length);
}

function shuffle(items, random = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = pickIndex(i + 1, random);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function availableItems(items, usedKeys, keyFor) {
  const available = items.filter((item) => !usedKeys.has(keyFor(item)));
  return available.length > 0 ? available : items;
}

function cloneItem(item) {
  return { ...item, words: [...item.words] };
}

export function createCharacterPlan() {
  return splitLessons(8, "char").map((lesson) => ({
    id: lesson.id,
    title: `${lesson.title} · 认字`,
    description: "看生字，选择带声调的正确读音。",
    goalCorrect: Math.min(8, lesson.items.length),
    items: lesson.items.map(cloneItem),
  }));
}

export function createWordPlan() {
  const uniqueItems = [];
  const seenCharacters = new Set();
  LESSONS.flatMap((lesson) => lesson.items).forEach((item) => {
    if (seenCharacters.has(item.char)) return;
    seenCharacters.add(item.char);
    uniqueItems.push(item);
  });
  const remaining = [...uniqueItems];
  const levels = [];
  while (remaining.length > 0) {
    const items = [];
    const usedWords = new Set();
    while (items.length < 4 && remaining.length > 0) {
      const nextIndex = remaining.findIndex((item) => !usedWords.has(item.words[0]));
      if (nextIndex < 0) break;
      const [item] = remaining.splice(nextIndex, 1);
      items.push(item);
      usedWords.add(item.words[0]);
    }
    levels.push({
      id: `word-match-${levels.length + 1}`,
      title: `组词第 ${levels.length + 1} 关`,
      description: "上下两排字卡，配成四个词语。",
      goalCorrect: items.length,
      items: items.map(cloneItem),
      words: items.map((item) => ({ char: item.char, word: item.words[0] })),
    });
  }
  return levels;
}

export function createSentencePlan() {
  const promptFor = (item, itemIndex) => {
    const patterns = [
      `“${item.char}”可以组成词语____。`,
      `词语____中有“${item.char}”字。`,
      `请选择带有“${item.char}”字的词语：____。`,
      `和“${item.char}”字搭配正确的词语是____。`,
      `把“${item.char}”组成词语，应该选____。`,
      `____是含有“${item.char}”字的词语。`,
    ];
    return patterns[itemIndex % patterns.length];
  };
  return splitLessons(8, "sentence").map((lesson) => ({
    id: lesson.id,
    title: `${lesson.title} · 句子`,
    description: "选择合适的词语，把句子补充完整。",
    goalCorrect: Math.min(8, lesson.items.length),
    items: lesson.items.map((item, itemIndex) => {
      const wrongItem = lesson.items.find((candidate, candidateIndex) => (
        candidateIndex !== itemIndex && candidate.words[0] !== item.words[0]
      ));
      return {
        ...cloneItem(item),
        prompt: promptFor(item, itemIndex),
        answer: item.words[0],
        wrong: wrongItem?.words[0] || "词语",
      };
    }),
  }));
}

function createCharacterQuestion(level, random, usedKeys) {
  const source = availableItems(level.items, usedKeys, (item) => `${level.id}:${item.char}`);
  const item = source[pickIndex(source.length, random)];
  const pinyinPool = level.items.map((entry) => entry.pinyin).filter((value) => value !== item.pinyin);
  const options = shuffle([item.pinyin, ...shuffle([...new Set(pinyinPool)], random).slice(0, 2)], random);
  return {
    mode: "character",
    prompt: item.char,
    fullSentence: `${item.char} 读 ${item.pinyin}`,
    answer: item.pinyin,
    options,
    questionKey: `${level.id}:${item.char}`,
  };
}

function createWordQuestion(level, random, usedKeys) {
  const uniqueWords = [...new Map(level.words
    .filter((entry) => Array.from(entry.word).length === 2)
    .map((entry) => [entry.word, entry])).values()];
  const source = availableItems(uniqueWords, usedKeys, (entry) => `${level.id}:${entry.word}`);
  const pairs = shuffle(source, random).slice(0, 4).map((entry) => {
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
    questionKeys: pairs.map((pair) => `${level.id}:${pair.word}`),
  };
}

function createSentenceQuestion(level, random, usedKeys) {
  const source = availableItems(level.items, usedKeys, (item) => `${level.id}:${item.char}`);
  const item = source[pickIndex(source.length, random)];
  return {
    mode: "sentence",
    prompt: item.prompt,
    fullSentence: item.prompt.replace("____", item.answer),
    answer: item.answer,
    options: shuffle([item.answer, item.wrong], random),
    questionKey: `${level.id}:${item.char}`,
  };
}

export function createChineseQuestion(level, random = Math.random, usedKeys = new Set()) {
  if (level.id.startsWith("char-")) return createCharacterQuestion(level, random, usedKeys);
  if (level.id.startsWith("word-")) return createWordQuestion(level, random, usedKeys);
  return createSentenceQuestion(level, random, usedKeys);
}
