import { ShieldCheck, HeartPulse, Cpu, LayoutGrid } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// 연구 주제 카테고리 (게재 매체 status와는 별개의 축)
export const TOPIC_KEYS = ['copyright-ai', 'bio-health', 'applied-ai'] as const;
export type TopicKey = (typeof TOPIC_KEYS)[number];

// 주제 선택 화면의 '전체' 옵션
export const ALL_TOPICS = 'all';
export type TopicSelection = TopicKey | typeof ALL_TOPICS;

export type Topic = {
  key: TopicKey;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
  hoverBorder: string;
};

export const TOPICS: Topic[] = [
  {
    key: 'copyright-ai',
    label: 'Copyright Technology',
    description: 'Watermarking, content identification & retrieval, digital forensics, and machine unlearning',
    icon: ShieldCheck,
    color: 'text-[#4dabf7]',
    bg: 'bg-[#4dabf7]/10',
    border: 'border-[#4dabf7]/20',
    hoverBorder: 'hover:border-[#4dabf7]/40'
  },
  {
    key: 'bio-health',
    label: 'Bio-AI',
    description: 'Medical imaging AI, drug discovery, and natural product research',
    icon: HeartPulse,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'border-green-400/20',
    hoverBorder: 'hover:border-green-400/40'
  },
  {
    key: 'applied-ai',
    label: 'Applied AI',
    description: 'Banknote & iris recognition, edge computing, and smart agriculture',
    icon: Cpu,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/20',
    hoverBorder: 'hover:border-orange-400/40'
  }
];

export const ALL_TOPICS_ICON = LayoutGrid;

// 항목이 선택된 주제에 속하는지 판단. 'all'이면 전부 통과시킨다.
export const matchesTopic = (topics: string[] | undefined, selected: TopicSelection) => {
  if (selected === ALL_TOPICS) return true;
  return (topics || []).includes(selected);
};
