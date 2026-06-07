import type { Category } from '@/types';

// WorkPiServ - Categories focused on human skills AI cannot replace
export const categories: Category[] = [
  { id: 'design', name: 'Design', icon: 'Palette', count: 42 },
  { id: 'development', name: 'Development', icon: 'Code', count: 68 },
  { id: 'marketing', name: 'Marketing', icon: 'Megaphone', count: 35 },
  { id: 'writing', name: 'Writing & Translation', icon: 'Pen', count: 28 },
  { id: 'video', name: 'Video & Animation', icon: 'Clapperboard', count: 19 },
  { id: 'audio', name: 'Audio & Voice', icon: 'Mic', count: 15 },
  { id: 'business', name: 'Business', icon: 'Briefcase', count: 52 },
  { id: 'consulting', name: 'Consulting', icon: 'Lightbulb', count: 48 },
];

export const categoryIcons: Record<string, string> = {
  design: 'Palette',
  development: 'Code',
  marketing: 'Megaphone',
  writing: 'Pen',
  video: 'Clapperboard',
  audio: 'Mic',
  business: 'Briefcase',
  consulting: 'Lightbulb',
};
