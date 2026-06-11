/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RoastedLegItem {
  id: string;
  name: string;
  type: 'goose' | 'duck' | 'zombie' | 'cursed';
  isGoose: boolean;
  scoreValue: number;
  // Visual attributes for the custom renderer
  boneLength: 'shorthick' | 'longthick' | 'thin' | 'greenish';
  meatColor: string; // hex or tailwind class
  hasSteam: boolean;
  gildedShiny: boolean;
  burntSpots: boolean;
  label?: string; // Text on the leg label e.g., "阿姨手作鹅腿", "香酥大鸭腿", "科技鹅腿"
  labelBgColor?: string; // Color of the tag
  details: string[]; // Dynamic text attributes (e.g., "皮脂厚实", "肉色发绿", "异股酸味")
  difficulty: number; // 1: Human, 2: PKU East Gate, 3: Tsinghua NE Gate (Cursed)
  soundOnSpawn?: 'goose' | 'duck' | 'zombie';
}

export interface StudentItem {
  id: string;
  name: string;
  school: 'PKU' | 'THU' | 'RUC'; // Peking, Tsinghua, Renmin
  avatar: string; // Emoji
  quote: string;
  requestGooseAmount: number;
  timeLimit: number; // seconds
}

export type GameStatus = 'HOME' | 'PLAYING' | 'WECHAT_NOTICE' | 'GAME_OVER';

export interface ScoreRecord {
  id: string;
  playerName: string;
  score: number;
  correctAnswers: number;
  collapsedCount: number;
  date: string;
  highestLevel: string;
}

export interface AuntieQuote {
  minScore: number;
  title: string; // 段位名称
  quote: string; // 阿姨回应台词
  locked: boolean;
}
