/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RoastedLegItem, StudentItem, GameStatus, ScoreRecord } from './types';
import { sfx } from './utils/audio';
import { LegRenderer } from './components/LegRenderer';
import { StudentCard } from './components/StudentCard';
import { AuntieNotice } from './components/AuntieNotice';
import { ShareModal } from './components/ShareModal';
import {
  Flame,
  Award,
  CircleAlert,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Volume,
  Clock,
  Skull,
  UserCheck,
  Building2,
  XCircle,
  HelpCircle as QuestionIcon,
  ChevronsLeft,
  ChevronsRight,
  ShieldAlert,
  BookOpen
} from 'lucide-react';

// Name factory generators for Roast Legs (Procedural list of memes)
const GOOSE_NAMES = [
  '正宗香酥脆皮大鹅腿',
  '阿姨密酿北京爆汁鹅腿',
  '中关村文理一等奖学金尊享鹅腿',
  '五道口保研大壮壮鹅腿',
  '双榆树考研顺利黄金鹅腿',
  '炭烤皮脂焦脆大鹅腿',
  '深夜暖心手撕纯鹅腿',
];

const DUCK_NAMES = [
  '精选优质大肥鸭腿',
  '街头风味香酥肥鸭腿',
  '大棚香精调味鸭肉腿',
  '常温充气保鲜速食鸭腿',
  '速冻工厂五香大鸭腿',
  '香料勾兑脆皮鸭边腿',
];

const ZOMBIE_NAMES = [
  '急冻库20年珍藏冷冻老腿',
  '工业福尔马林保鲜肉',
  '绿光科技合成高弹性大腿',
  '双氧水漂白黑心僵尸骨腿',
];

const CURSED_NAMES = [
  '香精辣椒水超长保质腿',
  '科技与狠活十倍催成肥腿',
  '重金属超标深海水煮腿',
];

const STUDENT_TEMPLATES = [
  {
    name: '五道口理工物院学生',
    school: 'THU' as const,
    avatar: '👨‍🔬',
    quote: '阿姨，我昨天推倒了热核公式，极度消耗脑力！能特批我两只真金大鹅腿续命吗？',
    type: 'true_student' as const,
  },
  {
    name: '中关村文理辩论队一辩',
    school: 'PKU' as const,
    avatar: '👩‍💼',
    quote: '学弟们要是今晚抢不到鹅腿都要去五道口食堂了！求阿姨匀两只真的大鹅腿稳住军心！',
    type: 'true_student' as const,
  },
  {
    name: '双榆树人文考研党',
    school: 'RUC' as const,
    avatar: '📚',
    quote: '距离研究生考研倒计时5天，吃一只阿姨的鹅腿，我的专业课成绩肯定大涨20分！',
    type: 'true_student' as const,
  },
  {
    name: '行迹可疑的中介黄牛',
    school: 'PKU' as const,
    avatar: '🕶️',
    quote: '阿姨，我是帮高校社团包场的。我出两倍价格，现在把整车50只腿全都打包卖我好吗？',
    type: 'scalper' as const,
  },
  {
    name: '隔壁大学鸭肉爱好者',
    school: 'RUC' as const,
    avatar: '😋',
    quote: '其实阿姨，我最爱吃鸭腿了，不仅肥美多汁，性价比还高，今晚给我整两包脆皮鸭腿呗？',
    type: 'duck_lover' as const,
  },
];

// Helper to get random item from list
const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Generate random roasting leg items
function generateRoastedLeg(difficulty: number): RoastedLegItem {
  const id = `leg-${Math.random().toString(36).substr(2, 9)}`;
  const roll = Math.random();

  // Difficulty multiplier
  // Difficulty 1: 85% normal legs. Labels are extremely honest.
  // Difficulty 2: 70% normal legs, 30% tricky/burny/cursed. Tag labels are ambiguous.
  // Difficulty 3: 50% tricky, green, cursed legs. No obvious labels.

  // Determine type
  let type: 'goose' | 'duck' | 'zombie' | 'cursed' = 'goose';
  let isGoose = true;

  if (difficulty === 1) {
    if (roll < 0.55) {
      type = 'goose';
      isGoose = true;
    } else {
      type = 'duck';
      isGoose = false;
    }
  } else if (difficulty === 2) {
    if (roll < 0.45) {
      type = 'goose';
      isGoose = true;
    } else if (roll < 0.8) {
      type = 'duck';
      isGoose = false;
    } else {
      type = 'zombie';
      isGoose = false;
    }
  } else {
    // Hard level
    if (roll < 0.35) {
      type = 'goose';
      isGoose = true;
    } else if (roll < 0.65) {
      type = 'duck';
      isGoose = false;
    } else if (roll < 0.85) {
      type = 'zombie';
      isGoose = false;
    } else {
      type = 'cursed';
      isGoose = false;
    }
  }

  // Set visual characteristics
  let boneLength: 'shorthick' | 'longthick' | 'thin' | 'greenish' = 'longthick';
  let meatColor = '#E07D34';
  let label = undefined;
  let labelBgColor = '#059669'; // Emerald
  const details: string[] = [];

  if (type === 'goose') {
    boneLength = 'longthick';
    meatColor = '#E07D34';
    details.push(pickRandom(['骨头长且粗', '肉质极紧实', '皮脂饱满']));
    if (Math.random() > 0.4) {
      label = pickRandom(['正宗手作鹅腿', '高校特供鹅', '大牌御膳']);
      labelBgColor = '#059669'; // Green label
    }
  } else if (type === 'duck') {
    boneLength = pickRandom(['shorthick', 'thin']);
    meatColor = '#C27C53';
    details.push(pickRandom(['骨头细短', '肥油较多', '表皮松散']));
    if (Math.random() > 0.5) {
      label = pickRandom(['优质好鸭腿', '大众平价大腿', '脆皮骨腿']);
      labelBgColor = '#475569'; // Slate
    }
  } else if (type === 'zombie') {
    boneLength = 'greenish';
    meatColor = '#5E7356';
    details.push(pickRandom(['肉色泛微绿', '散发股股腐臭', '速冻二十年']));
    if (Math.random() > 0.3) {
      label = pickRandom(['正宗好鹅腿', '阿姨香酥大腿']); // Tricky false label!
      labelBgColor = '#B45309'; // Warning Amber to fool user
    }
  } else if (type === 'cursed') {
    boneLength = 'thin';
    meatColor = '#45385C';
    details.push(pickRandom(['表呈紫黑色', '工业勾兑香气', '重金属香料']));
    if (Math.random() > 0.5) {
      label = pickRandom(['特级大壮腿', '独家黑科技']);
      labelBgColor = '#6D28D9'; // Purple
    }
  }

  // Assign name
  let name = '';
  switch (type) {
    case 'goose':
      name = pickRandom(GOOSE_NAMES);
      break;
    case 'duck':
      name = pickRandom(DUCK_NAMES);
      break;
    case 'zombie':
      name = pickRandom(ZOMBIE_NAMES);
      break;
    case 'cursed':
      name = pickRandom(CURSED_NAMES);
      break;
  }

  return {
    id,
    name,
    type,
    isGoose,
    scoreValue: isGoose ? 10 : 15,
    boneLength,
    meatColor,
    hasSteam: type === 'goose' || (type === 'duck' && Math.random() > 0.3),
    gildedShiny: type === 'goose' && Math.random() > 0.6,
    burntSpots: type === 'zombie' || Math.random() > 0.7,
    label,
    labelBgColor,
    details,
    difficulty,
  };
}

// Generate special student encounters
function generateStudent(difficulty: number) {
  const template = pickRandom(STUDENT_TEMPLATES);
  const idValue = `student-${Math.random().toString(36).substr(2, 9)}`;

  return {
    ...template,
    id: idValue,
    requestGooseAmount: Math.floor(Math.random() * 3) + 1,
    timeLimit: Math.max(6, 12 - difficulty * 1.5),
  };
}

export default function App() {
  // Game States
  const [status, setStatus] = useState<GameStatus>('HOME');
  const [playerName, setPlayerName] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [errors, setErrors] = useState<number>(0);
  const [collapsedCount, setCollapsedCount] = useState<number>(0); // Total mistakes made
  const [level, setLevel] = useState<number>(1); // 1, 2, 3
  const [timeLeft, setTimeLeft] = useState<number>(30); // Seconds
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);

  // Level up checkpoint modal states
  const [showLevelUpModal, setShowLevelUpModal] = useState<boolean>(false);
  const [pendingNextLevel, setPendingNextLevel] = useState<number>(1);

  // Keep track of previous choices to avoid consecutively repeating students or twins
  const [lastEntityWasStudent, setLastEntityWasStudent] = useState<boolean>(false);
  const [lastStudentIndex, setLastStudentIndex] = useState<number>(-1);

  // Current level progress (items cleared)
  const [roundCompletedCount, setRoundCompletedCount] = useState<number>(0);

  // Active game entities
  const [currentLeg, setCurrentLeg] = useState<RoastedLegItem | null>(null);
  const [currentStudent, setCurrentStudent] = useState<
    (StudentItem & { type: 'true_student' | 'scalper' | 'duck_lover' }) | null
  >(null);

  // Feedback states
  const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);
  const [shakeCard, setShakeCard] = useState<boolean>(false);

  // Triggered WeChat Notices tracker (allows only one notice checkpoint per game to save you)
  const [wechatNoticesTriggeredCount, setWechatNoticesTriggeredCount] = useState<number>(0);

  // Timers refs
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync Audio context settings with sfx state
  useEffect(() => {
    sfx.toggle(isAudioEnabled);
  }, [isAudioEnabled]);

  // Tick clock timer
  useEffect(() => {
    if (status === 'PLAYING' && !showLevelUpModal) {
      gameTimerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Out of Time
            handleGameOver();
            return 0;
          }
          // Tick sound in the final 5 seconds to build immense tension!
          if (prev <= 6) {
            sfx.playClockTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
    }

    return () => {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
    };
  }, [status, level, showLevelUpModal]);

  // Handle Keyboard shortcuts: Left/Right key controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== 'PLAYING' || showLevelUpModal) return;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        // Discard or Reject
        handleAction(false);
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        // Accept/Keep layout
        handleAction(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, currentLeg, currentStudent, showLevelUpModal]);

  // Setup Next Game Entity
  const setupNextEntity = (currentDifficulty: number = level) => {
    // 25% chance of spawning students on medium level upward, but NEVER consecutively
    const roll = Math.random();
    if (currentDifficulty >= 2 && roll < 0.28 && !lastEntityWasStudent) {
      setCurrentLeg(null);
      
      // Select non-consecutive student index
      let nextIndex = lastStudentIndex;
      while (nextIndex === lastStudentIndex || nextIndex < 0) {
        nextIndex = Math.floor(Math.random() * STUDENT_TEMPLATES.length);
      }
      setLastStudentIndex(nextIndex);

      const template = STUDENT_TEMPLATES[nextIndex];
      const idValue = `student-${Math.random().toString(36).substr(2, 9)}`;
      const spawnedStudent = {
        ...template,
        id: idValue,
        requestGooseAmount: Math.floor(Math.random() * 3) + 1,
        timeLimit: Math.max(6, 12 - currentDifficulty * 1.5),
      };

      setCurrentStudent(spawnedStudent);
      setLastEntityWasStudent(true);
    } else {
      setCurrentStudent(null);
      setCurrentLeg(generateRoastedLeg(currentDifficulty));
      setLastEntityWasStudent(false);
    }
  };

  // Start a new match
  const handleStartGame = () => {
    if (!playerName.trim()) {
      setPlayerName(pickRandom(['中关村吃货王', '五道口烤腿狂', '双榆树有缘食客', '匿名游侠', '各校名誉会长']));
    }
    sfx.playSuccess();
    setScore(0);
    setCorrectCount(0);
    setErrors(0);
    setCollapsedCount(0);
    setLevel(1);
    setTimeLeft(35);
    setRoundCompletedCount(0);
    setWechatNoticesTriggeredCount(0);
    setShowLevelUpModal(false);
    setLastEntityWasStudent(false);
    setLastStudentIndex(-1);
    setStatus('PLAYING');
    setupNextEntity(1);
  };

  // End match
  const handleGameOver = () => {
    sfx.playFailure();
    setStatus('GAME_OVER');
  };

  // Translate level numbers into beautiful college campus tags
  const getLevelName = (lvl: number) => {
    switch (lvl) {
      case 1:
        return '🏫 双榆树人文大学·西门西贡车';
      case 2:
        return '🌲 中关村文理学院·西门常青树下';
      case 3:
      default:
        return '💜 五道口理工学院·东北门校友岗';
    }
  };

  // Main gameplay choices
  const handleChoice = (actionValue: boolean) => {
    if (status !== 'PLAYING') return;
    handleAction(actionValue);
  };

  const handleAction = (userGaveToStudentOrKeep: boolean) => {
    if (feedback !== null) return; // Prevent double taps during animations

    let isCorrect = false;

    if (currentLeg) {
      // For leg: Is user correctly accepting a GOOSE leg, or rejecting an imposter leg?
      const itemIsGoose = currentLeg.isGoose;
      if (userGaveToStudentOrKeep) {
        // User agreed: they think it is Goose Leg
        isCorrect = itemIsGoose;
      } else {
        // User rejected: they think it is Fake/Duck/Zombie
        isCorrect = !itemIsGoose;
      }
    } else if (currentStudent) {
      // For students:
      const st = currentStudent;
      if (userGaveToStudentOrKeep) {
        // User hospitality: Agreed to transaction
        // Correct Action: Sell to true student OR Duck lover. INCORECT: Sell to Scalper.
        isCorrect = st.type !== 'scalper';
      } else {
        // User turned them away: Discarded
        // Correct Action: Turn away Scalper. INCORRECT: Turn away real student.
        isCorrect = st.type === 'scalper';
      }
    }

    let nextErrors = errors;

    if (isCorrect) {
      sfx.playSuccess();
      setFeedback('CORRECT');
      
      // Calculate score increments with streak bonuses
      const scoreGain = currentLeg ? currentLeg.scoreValue : 25;
      setScore((prev) => prev + scoreGain + level * 5);
      setCorrectCount((prev) => prev + 1);
    } else {
      sfx.playFailure();
      setFeedback('WRONG');
      setShakeCard(true);
      setTimeout(() => setShakeCard(false), 500);

      nextErrors = errors + 1;
      setErrors(nextErrors);
      setCollapsedCount((prev) => prev + 1);
      setTimeLeft((prev) => Math.max(3, prev - 4)); // Penalty of 4 seconds on mistakes
    }

    // Advance round progress
    const nextRoundCount = roundCompletedCount + 1;

    // Dynamic level progression after every 10 decisions
    const isLevelingUp = nextRoundCount >= 10 && level < 3;
    if (isLevelingUp) {
      setPendingNextLevel(level + 1);
      setShowLevelUpModal(true);
    } else {
      setRoundCompletedCount(nextRoundCount);
    }

    // Delay next item rendering to play feedback animations
    setTimeout(() => {
      setFeedback(null);

      // Check for WeChat group notice trigger: if error count reaches 2 or more, and they haven't been saved yet
      // This serves as a sweet gameplay buffer where Auntie pops out to give extra life!
      if (nextErrors >= 2 && wechatNoticesTriggeredCount === 0) {
        setWechatNoticesTriggeredCount(1);
        setStatus('WECHAT_NOTICE');
      } else if (nextErrors >= 5) {
        // Hard threshold for game over (Too many PR disasters - pure collapse!)
        handleGameOver();
      } else {
        if (!isLevelingUp) {
          setupNextEntity();
        }
      }
    }, 450);
  };

  // Exit "Auntie WeChat Notice" event.
  // Auntie recovers some reputation, gives you 2 errors back, and transitions to level 3 so you can redeem her!
  const handleCloseWechatNotice = () => {
    setErrors(1); // Reset partial failure state
    setLevel(3); // Bump up challenge to Tsinghua level immediately
    setRoundCompletedCount(0);
    setTimeLeft(30); // Give decent fresh timer
    setStatus('PLAYING');
    setupNextEntity(3);
  };

  const handleProceedToNextLevel = () => {
    sfx.playLevelUp();
    setLevel(pendingNextLevel);
    setRoundCompletedCount(0);
    setTimeLeft((prev) => Math.min(45, prev + 10)); // 10s reward on campus level up
    setShowLevelUpModal(false);
    setupNextEntity(pendingNextLevel);
  };

  return (
    <div id="game-root" className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      {/* Top Header Navigation bar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-4 py-3 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Animated Glowing Logo */}
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="text-orange-500 text-2xl"
            >
              🍗
            </motion.div>
            <div>
              <h1 className="font-extrabold text-white text-base tracking-tight flex items-center gap-1.5 font-sans">
                真假鹅腿挑战
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio speaker toggle */}
            <button
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-all hover:scale-105 active:scale-95"
            >
              {isAudioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Stage */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col justify-start">
        <AnimatePresence mode="wait">
          {/* STATE 1: LOBBY / HOME SCREEN */}
          {status === 'HOME' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex-1 flex flex-col md:grid md:grid-cols-5 gap-6 py-4"
              key="home"
            >
              {/* Introduction Details */}
              <div className="md:col-span-3 flex flex-col justify-center space-y-6">
                <div className="space-y-3">
                  <span className="bg-amber-500/10 text-amber-400 font-bold text-xs px-3.5 py-1.5 rounded-full border border-amber-500/20 inline-block font-sans">
                    🔥 火爆中关村的奇迹美食
                  </span>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
                    帮鹅腿阿姨 <br />
                    守护你的 <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">金字招牌</span>
                  </h2>
                  <p className="text-slate-300 text-sm leading-relaxed max-w-lg">
                    鹅腿阿姨在名校园区旁骑车兜售鹅腿，高校学子排长龙、拉微信群抢购！
                    但由于出货量大、有人浑水摸鱼，黑心商家用鸭肉甚至僵尸肉假冒鹅腿……
                    阿姨的名声岌岌可危！你能帮阿姨在疯狂人流中，快速验明真身，防范塌房吗？
                  </p>
                </div>

                {/* Name fields and trigger */}
                <div className="bg-slate-800/30 border border-slate-800 rounded-3xl p-5 space-y-4 max-w-md">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-2 font-mono">
                      输入你的大侠名号
                    </label>
                    <input
                      type="text"
                      maxLength={14}
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="例如：文理学院物理第一号/理工学院干饭王"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-sans"
                    />
                  </div>

                  <button
                    onClick={handleStartGame}
                    className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:opacity-95 active:scale-95 transition-all text-white font-extrabold py-3.5 px-6 rounded-xl text-base shadow-xl shadow-orange-900/15 flex items-center justify-center gap-2"
                  >
                    <Play size={18} fill="currentColor" />
                    <span>开始挑战</span>
                  </button>
                  <p className="text-[10px] text-center text-slate-500 font-medium">
                    🕹️ 支持：👈 A键/左滑(假货) ｜ 底部按钮直接点击 ｜ 右滑/D键(正宗) 👉
                  </p>
                </div>
              </div>

              {/* Guidelines Column */}
              <div className="md:col-span-2 flex flex-col justify-start space-y-4">
                {/* Guidelines cheat-sheet */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4.5 text-xs space-y-4 shadow-lg">
                  <h4 className="font-bold text-slate-200 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                    <CircleAlert size={14} className="text-amber-500" />
                    <span>辨腿官方指南 & 独门大典</span>
                  </h4>
                  
                  <div className="space-y-2">
                    <h5 className="font-bold text-amber-400 text-[11px] mb-1">📋 核心产品分类：</h5>
                    <ul className="space-y-1.5 text-slate-300 leading-normal">
                      <li>🟢 <strong className="text-emerald-400 font-sans">正宗鹅腿：</strong> 骨头长且粗壮，皮脂肥厚饱满，热蒸汽腾腾。</li>
                      <li>🔴 <strong className="text-slate-400 font-sans">山寨鸭腿：</strong> 骨头细且短，肥瘦纹理不明显，常贴伪劣标签。</li>
                      <li>🧟 <strong className="text-red-400 font-sans">僵尸大肉：</strong> 颜色发微绿、散发腐败冷冻气。直接点“假货”！</li>
                      <li>🎓 <strong className="text-indigo-400 font-sans">高校学霸：</strong> 好客招待有惊喜，但严防倒卖包场黄牛，直接打发！</li>
                    </ul>
                  </div>

                  <div className="space-y-2 border-t border-slate-800/80 pt-3">
                    <h5 className="font-bold text-amber-400 text-[11px] mb-1">🦴 阿姨独家秘制辨腿法典：</h5>
                    <div className="space-y-2 text-slate-400 text-[11px] leading-relaxed">
                      <p>
                        <strong className="text-slate-200">1. 骨骼识真伪：</strong> 
                        鹅腿的骨头极长且粗壮饱满（含双截连骨），敲击质感沉重；而鸭腿骨极细极短。
                      </p>
                      <p>
                        <strong className="text-slate-200">2. 皮层与肉相：</strong> 
                        真大腿在光下金黄剔透、有热烟；化学腿常呈妖娆紫黑色；变质货更可能存在局部的发绿与黑腐斑。
                      </p>
                      <p>
                        <strong className="text-slate-200">3. 防范转卖：</strong> 
                        若是遇到假冒学生组织、“双倍高价、整车收走”图谋包场的黑心黄牛别卖，直接拒绝打发（选非鹅腿）。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STATE 2: ACTIVE PLAYING */}
          {status === 'PLAYING' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col max-w-md mx-auto py-2"
              key="playing"
            >
              {/* Game Stats Panel Header */}
              <div className="mb-4 space-y-2 select-none">
                {/* Campus stage cards */}
                <div className="flex items-center justify-between text-xs font-semibold bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-sm">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Building2 size={14} className="text-amber-500" />
                    <span>{getLevelName(level)}</span>
                  </span>
                  
                  {/* Progress indicator */}
                  <span className="text-orange-500 font-mono text-[10px] bg-orange-500/10 px-2 py-0.5 rounded">
                    今日出货: {roundCompletedCount}/10
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* Score */}
                  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-2 text-center">
                    <span className="text-[9px] text-slate-500 font-bold block mb-0.5">积攒口碑</span>
                    <strong className="text-base font-black text-white font-mono block">
                      {score} <span className="text-[10px] text-slate-400 font-normal">分</span>
                    </strong>
                  </div>

                  {/* Timer */}
                  <div className={`border rounded-xl p-2 text-center transition-colors duration-300 ${
                    timeLeft <= 7 ? 'bg-red-950/40 border-red-800 text-red-400' : 'bg-slate-900/50 border-slate-800 text-white'
                  }`}>
                    <span className="text-[9px] text-slate-500 font-bold block mb-0.5 flex items-center justify-center gap-0.5">
                      <Clock size={10} className={timeLeft <= 7 ? 'animate-spin' : ''} />
                      剩余时间
                    </span>
                    <strong className="text-base font-black font-mono block">
                      {timeLeft} <span className="text-[10px] text-slate-400 font-normal">秒</span>
                    </strong>
                  </div>

                  {/* Trust collapse hearts representation */}
                  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-2 text-center">
                    <span className="text-[9px] text-slate-500 font-block block mb-0.5">塌房指数</span>
                    <div className="flex justify-center items-center gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <span key={idx} className="text-xs transition-transform duration-300">
                          {idx < errors ? '🏚️' : '❤️'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Core interactive Card Area */}
              <div className="relative flex-1 flex flex-col justify-center min-h-[350px]">
                {/* Score pop ups Feedback Banner */}
                <AnimatePresence>
                  {feedback === 'CORRECT' && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0, y: 15 }}
                      animate={{ scale: 1.1, opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute inset-x-0 -top-4 text-center z-20 pointer-events-none"
                    >
                      <span className="bg-emerald-500 text-white text-xs font-black px-4 py-2 rounded-full shadow-lg border border-emerald-400 tracking-wider inline-flex items-center gap-1">
                        ✨ 判别完美！阿姨口碑 +10
                      </span>
                    </motion.div>
                  )}
                  {feedback === 'WRONG' && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0, y: 15 }}
                      animate={{ scale: 1.1, opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute inset-x-0 -top-4 text-center z-20 pointer-events-none"
                    >
                      <span className="bg-rose-600 text-white text-xs font-black px-4 py-2 rounded-full shadow-lg border border-rose-500 tracking-wide inline-flex items-center gap-1 text-center">
                        🚨 塌房了！舆论发酵 -4秒
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tinder Dragging interaction simulation container */}
                <motion.div
                  animate={
                    shakeCard
                      ? { x: [-10, 10, -10, 10, 0] }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.4 }}
                  className="w-full pointer-events-auto"
                >
                  {currentLeg && (
                    <motion.div 
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.6}
                      onDragEnd={(event, info) => {
                        if (info.offset.x < -80) {
                          handleChoice(false);
                        } else if (info.offset.x > 80) {
                          handleChoice(true);
                        }
                      }}
                      whileDrag={{ scale: 1.03 }}
                      className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-5 shadow-2xl relative cursor-grab active:cursor-grabbing touch-none select-none"
                      layoutId="card-container"
                    >
                      {/* Name tags */}
                      <div className="text-center mb-1">
                        <span className="text-[9px] uppercase tracking-widest font-black text-slate-500 font-sans block">
                          烤腿品质鉴定
                        </span>
                        <h3 className="text-lg font-black text-white px-2 py-1 leading-tight tracking-tight font-sans">
                          {currentLeg.name}
                        </h3>
                      </div>

                      {/* Giant Interactive Roast leg rendering */}
                      <LegRenderer item={currentLeg} />

                      {/* Direction labels on cards */}
                      <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-800/80 pt-3 mt-1 font-bold">
                        <span>👈 手机左滑 / A键: 不是鹅腿</span>
                        <span>D键 / 手机右滑 👉: 是真鹅腿 🟢</span>
                      </div>
                    </motion.div>
                  )}

                  {currentStudent && (
                    <StudentCard
                      student={currentStudent}
                      onInteract={handleAction}
                    />
                  )}
                </motion.div>
              </div>

              {/* Action Buttons Interface Footer */}
              <div className="grid grid-cols-2 gap-4 mt-6 pb-4">
                <button
                  onClick={() => handleChoice(false)}
                  className="bg-slate-900 hover:bg-slate-850 border border-slate-700/80 active:scale-95 transition-all py-3.5 px-4 rounded-2xl flex flex-col items-center justify-center group relative overflow-hidden"
                >
                  {/* Left swipe style helper */}
                  <div className="absolute left-0 inset-y-0 w-1 bg-red-600 group-hover:scale-y-110 transition-transform" />
                  <span className="text-xs text-red-500 font-bold flex items-center gap-1 mb-1">
                    <ChevronsLeft size={16} className="animate-pulse" />
                    假货/非鹅腿
                  </span>
                  <span className="text-[9px] text-slate-500 font-black">打发走/扔掉 (A)</span>
                </button>

                <button
                  onClick={() => handleChoice(true)}
                  className="bg-amber-500 hover:bg-amber-600 active:scale-95 transition-all text-slate-950 py-3.5 px-4 rounded-2xl shadow-lg shadow-amber-500/10 flex flex-col items-center justify-center group relative overflow-hidden"
                >
                  {/* Right swipe helper */}
                  <div className="absolute right-0 inset-y-0 w-1 bg-emerald-600 group-hover:scale-y-110 transition-transform" />
                  <span className="text-xs text-emerald-950 font-extrabold flex items-center gap-1 mb-1">
                    正宗真鹅腿
                    <ChevronsRight size={16} className="animate-pulse" />
                  </span>
                  <span className="text-[9px] text-amber-950/70 font-black">收下/招待他 (D)</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* STATE 3: WECHAT ANNOUNCEMENT POPUP (BUFFER BREAK) */}
          {status === 'WECHAT_NOTICE' && (
            <AuntieNotice 
              score={score} 
              onClose={handleCloseWechatNotice} 
            />
          )}

          {/* STATE 4: GAME OVER SCREEN */}
          {status === 'GAME_OVER' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 py-2"
              key="gameover"
            >
              <ShareModal
                score={score}
                correctAnswers={correctCount}
                collapsedCount={collapsedCount}
                playerName={playerName}
                onRestart={handleStartGame}
                onGoHome={() => setStatus('HOME')}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {showLevelUpModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl space-y-6"
            >
              <div className="flex justify-center">
                <div className="bg-amber-500/10 p-4 rounded-full border border-amber-500/30 text-amber-400 animate-bounce">
                  <Sparkles size={32} />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-amber-500 block">
                  CONGRATULATIONS / 校友盛赞
                </span>
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  🎉 成功解锁下一商区！
                </h3>
                <p className="text-xs text-slate-400 leading-normal">
                  你在当前区域的业务非常火爆，阿姨的诚实口碑大涨！下一站等待你的将是更具有考验性的名校战场：
                </p>
              </div>

              {/* Info Card on pending stage */}
              <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800 text-left space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <span className="text-lg">📍</span>
                  <span>{getLevelName(pendingNextLevel)}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {pendingNextLevel === 2 ? (
                    '这里聚集了极度挑剔的文理高材生和教授！假冒烤肉的伪装手段全面升级，常有各种假冒的黑心速冻肉企图鱼目混珠。辨别难度大增，戳亮眼睛！'
                  ) : (
                    '来到了量子物理和高科技狠活交汇的高地！此时会有心怀鬼胎的高校黄牛倒卖党猖獗，甚至会冒充‘班长包场’倒卖抬价。必须斩钉截铁地予以打发和拒绝！'
                  )}
                </p>
                <div className="text-[10px] text-emerald-400 font-bold font-mono pt-1">
                  🎁 升级福利：立刻恢复 +10 秒游戏倒计时！
                </div>
              </div>

              <button
                onClick={handleProceedToNextLevel}
                className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:opacity-95 active:scale-95 transition-all text-slate-950 font-black py-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xl shadow-orange-950/25"
              >
                <span>乘胜追击，前往下一站</span>
                <ChevronsRight size={14} />
              </button>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
