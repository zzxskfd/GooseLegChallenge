/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { MessageSquareCode, BellRing, Heart, Share2 } from 'lucide-react';
import { sfx } from '../utils/audio';

interface AuntieNoticeProps {
  onClose: () => void;
  score: number;
}

export const AuntieNotice: React.FC<AuntieNoticeProps> = ({ onClose, score }) => {
  React.useEffect(() => {
    sfx.playWeChatPing();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: -30, opacity: 0 }}
        className="w-full max-w-md bg-[#EDEDED] rounded-3xl overflow-hidden shadow-2xl border border-slate-300"
      >
        {/* WeChat Screen Simulation Header */}
        <div className="bg-[#191919] text-white px-5 py-3.5 flex items-center justify-between text-sm select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>
          <div className="font-bold tracking-wide">微信群公告</div>
          <div className="text-xs text-emerald-400 font-sans">100% 真实还原</div>
        </div>

        {/* Group Info Header */}
        <div className="bg-[#EDEDED] border-b border-slate-200 px-6 py-4 flex items-center gap-3">
          {/* Auntie's WeChat Avatar */}
          <div className="relative w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center border-2 border-orange-200 text-2xl shrink-0 shadow-sm">
            👵
            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-0.5 border border-white">
              <Heart size={10} fill="currentColor" />
            </div>
          </div>

          <div>
            <div className="font-bold text-slate-800 text-base">中关村暨五道口高校鹅腿福利群②</div>
            <div className="text-xs text-slate-500 mt-0.5">群主：鹅腿阿姨 ｜ 群人数：500人 (已满)</div>
          </div>
        </div>

        {/* The Announcement Box - Real Meme Content styled like WeChat Group Pin */}
        <div className="p-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative">
            {/* Red Alert / Pin Icon */}
            <div className="flex items-center gap-2 text-rose-500 font-bold text-xs mb-3.5 border-b border-rose-50 pb-2">
              <BellRing size={16} className="animate-bounce" />
              <span>群公告</span>
              <span className="ml-auto text-slate-400 font-normal">发表于 刚刚</span>
            </div>

            {/* Auntie Speech Content */}
            <div className="text-[13px] text-slate-700 leading-relaxed space-y-3 font-medium select-text">
              <p>
                「孩子们，阿姨今天真难过，看到网上有人说阿姨用假肉，我的眼泪都忍不住流下来。
              </p>
              <p className="text-orange-700 bg-orange-50 p-2 rounded-lg border-l-4 border-orange-500 font-semibold my-2">
                阿姨绝对是刚开始是鹅腿的！阿姨绝对不搞假账，从来不用假肉骗学生，挣得都是辛苦分！
              </p>
              <p>
                可能是后面做多做忙了，没有彻底写清楚，让大家误会了。孩子们还在网上拼命帮阿姨说话，阿姨都数不过来有多谢谢你们。
              </p>
              <p>
                今天阿姨先不出摊了，心里实在难受，回村里稍微避一下风头。等阿姨写清楚、分明白到底是鹅腿还是鸭腿，再拿出来给孩子们吃！谢谢你们……」
              </p>
            </div>

            {/* Sticky pin visual */}
            <div className="absolute top-4 right-4 text-emerald-600 font-mono text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              📌 置顶
            </div>
          </div>

          {/* Prompt Message */}
          <div className="mt-4 text-center">
            <span className="text-xs text-slate-500 bg-slate-200/50 px-3.5 py-1.5 rounded-full inline-block font-sans">
              ⚠️ 因为塌房负面爆仓，阿姨被迫发布公告。
            </span>
          </div>
        </div>

        {/* Action Button inside WeChat Notice */}
        <div className="bg-white px-6 py-5 border-t border-slate-200 flex flex-col gap-3">
          <button
            onClick={() => {
              sfx.playSuccess();
              onClose();
            }}
            className="w-full bg-[#07C160] hover:bg-[#06AD56] active:scale-[0.98] transition-all text-white font-bold py-3.5 rounded-xl shadow-md border-b-2 border-green-700 flex items-center justify-center gap-2 text-sm"
          >
            <MessageSquareCode size={18} />
            <span>支持阿姨！继续自证清白</span>
          </button>
          
          <div className="text-center">
            <p className="text-[10px] text-slate-400">
              点击上方按钮将重置 2 点塌房值，并升级到下一关！当前得分：<strong className="text-orange-600">{score}</strong>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
