import React from 'react';
import { GemType, SpecialType } from '../types';

interface GemIconProps {
  type: GemType;
  special?: SpecialType;
  className?: string;
}

export const GemIcon: React.FC<GemIconProps> = ({
  type,
  special = 'none',
  className = 'w-10 h-10',
}) => {
  const renderBaseGem = () => {
    switch (type) {
      case 'ruby':
        // Crimson Heart / Faceted Ruby
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="rubyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fda4af" />
                <stop offset="45%" stopColor="#e11d48" />
                <stop offset="100%" stopColor="#881337" />
              </linearGradient>
            </defs>
            <path
              d="M20,6 L33,14 L27,33 L13,33 L7,14 Z"
              fill="url(#rubyGrad)"
              stroke="#fecdd3"
              strokeWidth="1.5"
            />
            {/* Facet lines */}
            <line x1="20" y1="6" x2="20" y2="22" stroke="#ffe4e6" strokeWidth="1" opacity="0.6" />
            <line x1="7" y1="14" x2="20" y2="22" stroke="#ffe4e6" strokeWidth="1" opacity="0.6" />
            <line x1="33" y1="14" x2="20" y2="22" stroke="#ffe4e6" strokeWidth="1" opacity="0.6" />
            <line x1="13" y1="33" x2="20" y2="22" stroke="#ffe4e6" strokeWidth="1" opacity="0.6" />
            <line x1="27" y1="33" x2="20" y2="22" stroke="#ffe4e6" strokeWidth="1" opacity="0.6" />
            {/* Gloss highlight */}
            <circle cx="16" cy="12" r="2.5" fill="#ffffff" opacity="0.8" />
          </svg>
        );

      case 'amethyst':
        // Royal Hexagonal Amethyst
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="amethystGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e9d5ff" />
                <stop offset="50%" stopColor="#9333ea" />
                <stop offset="100%" stopColor="#4c1d95" />
              </linearGradient>
            </defs>
            <polygon
              points="20,5 34,13 34,27 20,35 6,27 6,13"
              fill="url(#amethystGrad)"
              stroke="#f3e8ff"
              strokeWidth="1.5"
            />
            {/* Facets */}
            <polygon points="20,12 28,17 28,23 20,28 12,23 12,17" fill="#c084fc" opacity="0.4" />
            <line x1="20" y1="5" x2="20" y2="12" stroke="#f3e8ff" strokeWidth="1" opacity="0.6" />
            <line x1="34" y1="13" x2="28" y2="17" stroke="#f3e8ff" strokeWidth="1" opacity="0.6" />
            <line x1="34" y1="27" x2="28" y2="23" stroke="#f3e8ff" strokeWidth="1" opacity="0.6" />
            <line x1="20" y1="35" x2="20" y2="28" stroke="#f3e8ff" strokeWidth="1" opacity="0.6" />
            <line x1="6" y1="27" x2="12" y2="23" stroke="#f3e8ff" strokeWidth="1" opacity="0.6" />
            <line x1="6" y1="13" x2="12" y2="17" stroke="#f3e8ff" strokeWidth="1" opacity="0.6" />
            <circle cx="16" cy="11" r="2.2" fill="#ffffff" opacity="0.85" />
          </svg>
        );

      case 'sapphire':
        // Ocean Rhombus Sapphire
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="sapphireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bae6fd" />
                <stop offset="45%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#082f49" />
              </linearGradient>
            </defs>
            <polygon
              points="20,4 35,20 20,36 5,20"
              fill="url(#sapphireGrad)"
              stroke="#e0f2fe"
              strokeWidth="1.5"
            />
            <polygon points="20,12 28,20 20,28 12,20" fill="#38bdf8" opacity="0.5" />
            <line x1="20" y1="4" x2="20" y2="12" stroke="#e0f2fe" strokeWidth="1" opacity="0.7" />
            <line x1="35" y1="20" x2="28" y2="20" stroke="#e0f2fe" strokeWidth="1" opacity="0.7" />
            <line x1="20" y1="36" x2="20" y2="28" stroke="#e0f2fe" strokeWidth="1" opacity="0.7" />
            <line x1="5" y1="20" x2="12" y2="20" stroke="#e0f2fe" strokeWidth="1" opacity="0.7" />
            <circle cx="15" cy="14" r="2.2" fill="#ffffff" opacity="0.85" />
          </svg>
        );

      case 'emerald':
        // Vivid Emerald Octagon / Square Diamond
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a7f3d0" />
                <stop offset="50%" stopColor="#059669" />
                <stop offset="100%" stopColor="#022c22" />
              </linearGradient>
            </defs>
            <polygon
              points="12,6 28,6 34,12 34,28 28,34 12,34 6,28 6,12"
              fill="url(#emeraldGrad)"
              stroke="#d1fae5"
              strokeWidth="1.5"
            />
            <rect x="12" y="12" width="16" height="16" fill="#34d399" opacity="0.4" />
            <line x1="12" y1="6" x2="12" y2="12" stroke="#d1fae5" strokeWidth="1" opacity="0.6" />
            <line x1="28" y1="6" x2="28" y2="12" stroke="#d1fae5" strokeWidth="1" opacity="0.6" />
            <line x1="34" y1="12" x2="28" y2="12" stroke="#d1fae5" strokeWidth="1" opacity="0.6" />
            <line x1="34" y1="28" x2="28" y2="28" stroke="#d1fae5" strokeWidth="1" opacity="0.6" />
            <circle cx="15" cy="12" r="2.2" fill="#ffffff" opacity="0.85" />
          </svg>
        );

      case 'topaz':
        // Golden Radiant Topaz (Star/Octagon)
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="topazGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#713f12" />
              </linearGradient>
            </defs>
            <polygon
              points="20,4 25,14 36,15 28,24 31,35 20,29 9,35 12,24 4,15 15,14"
              fill="url(#topazGrad)"
              stroke="#fef9c3"
              strokeWidth="1.2"
            />
            <circle cx="20" cy="20" r="5" fill="#fde047" opacity="0.8" />
            <circle cx="17" cy="15" r="2" fill="#ffffff" opacity="0.9" />
          </svg>
        );

      case 'quartz':
        // Prismatic White/Cyan Quartz
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="quartzGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#67e8f9" />
                <stop offset="100%" stopColor="#0e7490" />
              </linearGradient>
            </defs>
            <polygon
              points="20,4 32,10 30,30 20,36 10,30 8,10"
              fill="url(#quartzGrad)"
              stroke="#cffafe"
              strokeWidth="1.5"
            />
            <line x1="20" y1="4" x2="20" y2="36" stroke="#ffffff" strokeWidth="1.2" opacity="0.8" />
            <line x1="8" y1="10" x2="20" y2="20" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
            <line x1="32" y1="10" x2="20" y2="20" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
            <circle cx="16" cy="11" r="2.2" fill="#ffffff" opacity="0.95" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {renderBaseGem()}

      {/* Special overlays */}
      {special === 'striped_h' && (
        <div className="absolute inset-x-0 h-1.5 bg-white/90 shadow-[0_0_8px_#ffffff] rounded-full pointer-events-none" />
      )}

      {special === 'striped_v' && (
        <div className="absolute inset-y-0 w-1.5 bg-white/90 shadow-[0_0_8px_#ffffff] rounded-full pointer-events-none" />
      )}

      {special === 'bomb' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-4 h-4 rounded-full bg-amber-400 border border-white shadow-[0_0_12px_#f59e0b] animate-ping opacity-75" />
          <div className="w-3.5 h-3.5 rounded-full bg-amber-300 border border-white shadow-[0_0_8px_#f59e0b] absolute" />
        </div>
      )}

      {special === 'rainbow' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-rainbow">
          <div className="w-8 h-8 rounded-full border-2 border-dashed border-white shadow-[0_0_14px_#38bdf8]" />
          <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_10px_#ffffff]" />
        </div>
      )}
    </div>
  );
};
