import { ThemeId } from '../types';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  subtitle: string;
  boardBg: string;
  cellBg: string;
  cellBorder: string;
  accent: string;
  badgeBg: string;
  description: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  royal: {
    id: 'royal',
    name: 'Royal Clan',
    subtitle: 'Imperial Velvet & Amber Gold',
    boardBg: 'bg-gradient-to-b from-[#2d0b4e] via-[#1c0836] to-[#120422]',
    cellBg: 'bg-[#3b1263]/70 hover:bg-[#4a187d]/80',
    cellBorder: 'border-amber-400/30',
    accent: '#f59e0b',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    description: 'Classic opulent clan heritage with royal purple velvet and gold borders.',
  },
  celestial: {
    id: 'celestial',
    name: 'Celestial Void',
    subtitle: 'Deep Cosmos & Starlight',
    boardBg: 'bg-gradient-to-b from-[#0c1836] via-[#070f24] to-[#040817]',
    cellBg: 'bg-[#152754]/70 hover:bg-[#1d3570]/80',
    cellBorder: 'border-cyan-400/30',
    accent: '#38bdf8',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    description: 'Vast astral depths surrounded by shimmering starlight and cosmic sapphire.',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Grove',
    subtitle: 'Mystic Jade & Forest Runes',
    boardBg: 'bg-gradient-to-b from-[#09291b] via-[#051a11] to-[#020d09]',
    cellBg: 'bg-[#0f402c]/70 hover:bg-[#15543a]/80',
    cellBorder: 'border-emerald-400/30',
    accent: '#10b981',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    description: 'Ancient enchanted sanctuary infused with vitality and forest wisdom.',
  },
  volcanic: {
    id: 'volcanic',
    name: 'Volcanic Magma',
    subtitle: 'Obsidian & Molten Embers',
    boardBg: 'bg-gradient-to-b from-[#3b0b0b] via-[#240606] to-[#140202]',
    cellBg: 'bg-[#521313]/70 hover:bg-[#691a1a]/80',
    cellBorder: 'border-rose-500/30',
    accent: '#f43f5e',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    description: 'Blazing subterranean foundry where elemental magma forges mythical rubies.',
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Clan',
    subtitle: 'Neon Magenta & Cyber Cyan',
    boardBg: 'bg-gradient-to-b from-[#180930] via-[#0d041f] to-[#060112]',
    cellBg: 'bg-[#29104f]/70 hover:bg-[#38166d]/80',
    cellBorder: 'border-fuchsia-400/40',
    accent: '#e879f9',
    badgeBg: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40',
    description: 'High-tech neon grid pulsing with cyber-synthetic jewel frequencies.',
  },
};
