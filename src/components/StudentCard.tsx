/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { StudentItem } from '../types';
import { Award, Landmark, User, Zap } from 'lucide-react';

interface StudentCardProps {
  student: StudentItem & {
    type: 'true_student' | 'scalper' | 'duck_lover';
  };
  onInteract: (correctAction: boolean) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, onInteract }) => {
  const getSchoolColor = (school: string) => {
    switch (school) {
      case 'PKU': // Peking University fictionalised
        return {
          bg: 'bg-rose-50 border-rose-200',
          text: 'text-rose-900',
          badge: 'bg-rose-800 text-white',
          name: '中关村文理学院',
        };
      case 'THU': // Tsinghua University fictionalised
        return {
          bg: 'bg-purple-50 border-purple-200',
          text: 'text-purple-900',
          badge: 'bg-indigo-800 text-white',
          name: '五道口理工学院',
        };
      case 'RUC': // Renmin University fictionalised
      default:
        return {
          bg: 'bg-amber-50 border-amber-200',
          text: 'text-amber-900',
          badge: 'bg-amber-700 text-white',
          name: '双榆树人文大学',
        };
    }
  };

  const schoolStyle = getSchoolColor(student.school);

  return (
    <motion.div
      initial={{ scale: 0.9, y: 15, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.9, y: -15, opacity: 0 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      onDragEnd={(event, info) => {
        if (info.offset.x < -80) {
          onInteract(false);
        } else if (info.offset.x > 80) {
          onInteract(true);
        }
      }}
      whileDrag={{ scale: 1.03 }}
      className={`relative w-full border-2 rounded-2xl p-5 ${schoolStyle.bg} shadow-md flex flex-col mb-4 overflow-hidden cursor-grab active:cursor-grabbing touch-none select-none`}
    >
      {/* Absolute background accent */}
      <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 pointer-events-none">
        <Landmark size={120} />
      </div>

      <div className="flex items-center gap-3 mb-3">
        {/* Cartoon avatar using emoji and stylized frame */}
        <div className="relative w-14 h-14 rounded-full bg-white shadow-inner flex items-center justify-center text-3xl border border-slate-200 shrink-0">
          {student.avatar}
          {student.type === 'scalper' && (
            <div className="absolute -bottom-1 -right-1 bg-red-600 text-white p-0.5 rounded-full shadow-md">
              <Zap size={12} fill="currentColor" />
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-800 text-base">{student.name}</h4>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${schoolStyle.badge}`}>
              {schoolStyle.name}
            </span>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <User size={12} />
            {student.type === 'scalper' ? '行迹可疑的黄牛倒爷' : student.type === 'duck_lover' ? '省钱鸭腿爱好者' : '嗷嗷待哺的高校学霸'}
          </p>
        </div>
      </div>

      {/* Spoken Quote Dialog Box */}
      <div className="bg-white/95 border border-slate-100 rounded-xl p-3.5 shadow-sm text-sm text-slate-700 relative mb-4">
        {/* Speech bubble arrow */}
        <div className="absolute top-4 -left-2 w-4 h-4 bg-white/95 rotate-45 border-l border-b border-slate-200/50" />
        <p className="relative italic font-medium">“{student.quote}”</p>
      </div>

      {/* Tactical choices info */}
      <div className="text-xs font-semibold text-slate-600 flex justify-between items-center bg-slate-900/5 rounded-lg px-3 py-2">
        <span>当前诉求：</span>
        <span className="text-orange-700 font-bold">
          {student.type === 'scalper'
            ? '强行包场收50只鹅腿'
            : student.type === 'duck_lover'
            ? '便宜大碗 想要鸭腿'
            : `想要真正的大鹅腿 ${student.requestGooseAmount} 只`}
        </span>
      </div>

      {/* Choice Buttons inside App.tsx will handle decisions, but we explain rules here in card */}
      <div className="mt-3 flex gap-2 justify-center text-[10px] text-slate-500">
        <span className="bg-slate-100 px-2 py-1 rounded">👈 拖向左侧：打发走 / 拒绝</span>
        <span className="bg-slate-100 px-2 py-1 rounded">👉 拖向右侧：招待他 / 同意</span>
      </div>
    </motion.div>
  );
};
