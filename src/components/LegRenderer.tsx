/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { RoastedLegItem } from '../types';
import { Sparkles, CircleAlert, Flame, Bone } from 'lucide-react';

interface LegRendererProps {
  item: RoastedLegItem;
}

export const LegRenderer: React.FC<LegRendererProps> = ({ item }) => {
  const {
    id,
    type,
    isGoose,
    boneLength,
    meatColor,
    hasSteam,
    gildedShiny,
    burntSpots,
    label,
    labelBgColor,
    details,
  } = item;

  // Render steam lines
  const renderSteam = () => {
    if (!hasSteam) return null;
    return (
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none z-10">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1 h-10 bg-orange-100/40 rounded-full blur-[2px]"
            initial={{ y: 15, opacity: 0, scaleX: 1 }}
            animate={{
              y: -25,
              opacity: [0, 0.7, 0],
              scaleX: [1, 1.5, 0.8],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    );
  };

  // Render shiny sparks
  const renderSparks = () => {
    if (!gildedShiny) return null;
    return (
      <div className="absolute inset-0 pointer-events-none">
        {[
          { top: '15%', left: '25%' },
          { top: '25%', left: '75%' },
          { top: '65%', left: '30%' },
          { top: '45%', left: '80%' },
        ].map((pos, idx) => (
          <motion.div
            key={idx}
            className="absolute text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]"
            style={pos}
            initial={{ scale: 0, rotate: 0 }}
            animate={{
              scale: [0, 1.2, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: idx * 0.35,
              ease: 'easeInOut',
            }}
          >
            <Sparkles size={16} fill="currentColor" />
          </motion.div>
        ))}
      </div>
    );
  };

  // Bone properties
  let bonePath = '';
  let boneColor = '#EAEAEA';
  if (boneLength === 'longthick') {
    // Elegant goose-like bone path
    bonePath = 'M 180 180 L 260 260 M 255 245 C 275 225, 295 245, 275 265 C 295 285, 275 305, 255 285 Z';
  } else if (boneLength === 'shorthick') {
    // Stubby duck bone
    bonePath = 'M 160 160 L 210 210 M 205 195 C 220 180, 235 195, 220 210 C 235 225, 220 240, 205 225 Z';
  } else if (boneLength === 'greenish') {
    // Moldy or weird bone
    bonePath = 'M 170 170 L 240 240 M 235 225 C 245 210, 265 225, 245 245 C 265 265, 245 285, 225 265 Z';
    boneColor = '#B2C4A2';
  } else {
    // thin bone
    bonePath = 'M 170 170 L 230 230 M 225 215 C 235 205, 245 215, 235 225 C 245 235, 235 245, 225 235 Z';
  }

  // Set meat gradient coloring
  const getGradientColors = () => {
    switch (type) {
      case 'zombie':
        return { start: '#5E7356', end: '#303D2B', highlight: '#738F69' };
      case 'cursed':
        return { start: '#45385C', end: '#231B30', highlight: '#645480' };
      case 'duck':
        return { start: '#C27C53', end: '#804E30', highlight: '#DE996F' };
      case 'goose':
      default:
        return { start: '#E07D34', end: '#9E4C11', highlight: '#FFA45C' };
    }
  };

  const gradients = getGradientColors();

  return (
    <div className="relative w-full h-64 flex items-center justify-center select-none bg-slate-900/10 rounded-2xl p-4 overflow-hidden mb-4 border border-slate-200/50">
      {/* Dynamic Background aura */}
      <div 
        className="absolute inset-0 opacity-10 blur-3xl transition-colors duration-500" 
        style={{ backgroundColor: gradients.start }}
      />
      
      {renderSteam()}
      {renderSparks()}

      {/* Main SVG Graphic */}
      <svg
        viewBox="0 0 300 300"
        className="w-52 h-52 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.15)] z-0"
      >
        <defs>
          <radialGradient id={`meatGrad-${id}`} cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor={gradients.highlight} />
            <stop offset="60%" stopColor={gradients.start} />
            <stop offset="100%" stopColor={gradients.end} />
          </radialGradient>
          
          <linearGradient id={`boneGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF" stopOpacity={0.9} />
            <stop offset="50%" stopColor={boneColor} />
            <stop offset="100%" stopColor="#8A8A8A" stopOpacity={0.4} />
          </linearGradient>

          <filter id={`shadow-${id}`}>
            <feDropShadow dx="2" dy="5" stdDeviation="4" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Bone */}
        <path
          d={bonePath}
          fill="none"
          stroke={`url(#boneGrad-${id})`}
          strokeWidth="24"
          strokeLinecap="round"
          className="transition-all duration-300"
        />
        {/* Bone Joints caps */}
        {boneLength === 'longthick' && (
          <g fill={boneColor}>
            <circle cx="265" cy="240" r="16" />
            <circle cx="280" cy="265" r="16" />
          </g>
        )}
        {boneLength === 'shorthick' && (
          <g fill={boneColor}>
            <circle cx="205" cy="180" r="13" />
            <circle cx="218" cy="200" r="13" />
          </g>
        )}
        {boneLength === 'greenish' && (
          <g fill={boneColor}>
            <circle cx="240" cy="215" r="14" fill="#8EA181"/>
            <circle cx="255" cy="240" r="14" fill="#8EA181"/>
          </g>
        )}

        {/* Roasted Meat Blob */}
        {/* Dynamic shape of goose leg (rich teardrop fat look) vs duck leg (thin or lumpy) */}
        <path
          d={
            isGoose
              ? 'M 60 120 C 40 180, 100 230, 170 190 C 230 150, 180 80, 120 70 C 85 65, 75 80, 60 120 Z'
              : 'M 75 125 C 60 170, 100 210, 155 175 C 200 145, 170 95, 125 85 C 95 80, 85 95, 75 125 Z'
          }
          fill={`url(#meatGrad-${id})`}
          className="transition-all duration-300 transform-gpu cursor-grab active:cursor-grabbing"
        />

        {/* Crispy Skin Texture Lines */}
        {isGoose ? (
          <g stroke="#FFF" strokeWidth="2" strokeLinecap="round" opacity="0.25">
            {/* Elegant wavy lines for fatty juicy roast goose */}
            <path d="M 85 100 C 95 120, 115 110, 130 130" fill="none" />
            <path d="M 110 90 C 120 115, 140 110, 155 135" fill="none" />
            <path d="M 75 135 C 90 150, 105 140, 125 160" fill="none" />
          </g>
        ) : (
          <g stroke="#000" strokeWidth="1.5" strokeLinecap="round" opacity="0.15">
            {/* Dull, straight lines */}
            <path d="M 95 110 L 125 120" />
            <path d="M 115 100 L 145 110" />
          </g>
        )}

        {/* Glistening spots / Golden sparks of oil */}
        {isGoose && (
          <g fill="#FFF" opacity="0.6">
            <ellipse cx="105" cy="115" rx="5" ry="3" transform="rotate(-15 105 115)" />
            <ellipse cx="140" cy="100" rx="8" ry="4" transform="rotate(-30 140 100)" />
            <ellipse cx="115" cy="145" rx="4" ry="2" transform="rotate(10 115 145)" />
          </g>
        )}

        {/* Burnt Charcoal Spots (adds roasted authenticity, or carbon) */}
        {burntSpots && (
          <g fill="#2B1F17" opacity="0.8">
            <circle cx="85" cy="140" r="4.5" />
            <circle cx="150" cy="125" r="3" />
            <circle cx="120" cy="165" r="5" />
            <circle cx="95" cy="95" r="3.5" />
          </g>
        )}

        {/* Zombie patches like mold (greenish circles) */}
        {type === 'zombie' && (
          <g fill="#8EAA76" opacity="0.85">
            <circle cx="100" cy="130" r="6" />
            <circle cx="130" cy="120" r="5" />
            <circle cx="110" cy="160" r="8" />
            <path d="M 90 150 Q 80 160, 95 170" fill="none" stroke="#75935E" strokeWidth="3" strokeLinecap="round"/>
          </g>
        )}

        {/* Cursed purplish toxic steam bubbles */}
        {type === 'cursed' && (
          <g fill="#82669C" opacity="0.9">
            <circle cx="110" cy="110" r="7" />
            <circle cx="135" cy="140" r="5" />
            <path d="M 70 120 C 65 100, 50 110, 45 90" fill="none" stroke="#5C4573" strokeWidth="2.5" />
          </g>
        )}
      </svg>

      {/* Floating Tag or Stamp Label */}
      {label && (
        <div 
          className="absolute bottom-3 right-3 px-3 py-1 text-[11px] font-bold text-white rounded-md shadow-md flex items-center gap-1 uppercase tracking-wider"
          style={{ backgroundColor: labelBgColor || '#475569' }}
        >
          {isGoose && <Flame size={12} fill="currentColor" />}
          {!isGoose && <CircleAlert size={12} />}
          {label}
        </div>
      )}

      {/* Description / Attributes Overlay */}
      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
        {details.map((detail, index) => (
          <span 
            key={index} 
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium shadow-sm border ${
              type === 'zombie' || type === 'cursed'
                ? 'bg-red-950/90 text-red-100 border-red-800'
                : isGoose
                ? 'bg-amber-950/80 text-amber-200 border-amber-800'
                : 'bg-slate-900/80 text-slate-200 border-slate-700'
            }`}
          >
            {detail}
          </span>
        ))}
      </div>
    </div>
  );
};
