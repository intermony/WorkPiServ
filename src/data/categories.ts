import type { Category } from '@/types';

// Counts are set to 0 — calculated dynamically in MarketplacePage from real API data
export const categories: Category[] = [
  { id: 'design',      name: 'Design',              icon: 'Palette',     count: 0 },
  { id: 'development', name: 'Development',          icon: 'Code',        count: 0 },
  { id: 'marketing',   name: 'Marketing',            icon: 'Megaphone',   count: 0 },
  { id: 'writing',     name: 'Writing & Translation',icon: 'Pen',         count: 0 },
  { id: 'video',       name: 'Video & Animation',    icon: 'Clapperboard',count: 0 },
  { id: 'audio',       name: 'Audio & Voice',        icon: 'Mic',         count: 0 },
  { id: 'business',    name: 'Business',             icon: 'Briefcase',   count: 0 },
  { id: 'consulting',  name: 'Consulting',           icon: 'Lightbulb',   count: 0 },
];

export const categoryIcons: Record<string, string> = {
  design:      'Palette',
  development: 'Code',
  marketing:   'Megaphone',
  writing:     'Pen',
  video:       'Clapperboard',
  audio:       'Mic',
  business:    'Briefcase',
  consulting:  'Lightbulb',
};
