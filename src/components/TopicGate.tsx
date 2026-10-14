import { ArrowRight } from 'lucide-react';
import { TOPICS, ALL_TOPICS, ALL_TOPICS_ICON } from '../constants/topics';
import type { TopicSelection } from '../constants/topics';

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  allLabel: string;
  onSelect: (topic: TopicSelection) => void;
};

// 게재 매체(status) 화면 앞에 놓이는 주제 선택 단계
const TopicGate = ({ eyebrow, title, subtitle, allLabel, onSelect }: Props) => {
  const AllIcon = ALL_TOPICS_ICON;

  return (
    <div
      className="w-full !bg-[#0f1420] pt-32 pb-24 min-h-screen !text-white"
      style={{ colorScheme: 'dark' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-[#4dabf7] font-semibold tracking-widest uppercase text-lg mb-3">{eyebrow}</h2>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight !text-white">{title}</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TOPICS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => onSelect(t.key)}
                className={`group text-left !bg-[#151b2b] rounded-3xl p-8 border border-white/5 ${t.hoverBorder} transition-all duration-300 hover:shadow-2xl hover:shadow-black/20 flex flex-col`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${t.bg} ${t.border} border`}>
                  <span className={t.color}><Icon size={26} /></span>
                </div>

                <h3 className="text-2xl font-bold !text-white mb-4">{t.label}</h3>
                <p className="text-gray-400 text-sm leading-relaxed flex-grow">{t.description}</p>

                <div className={`mt-8 flex items-center gap-2 text-sm ${t.color}`}>
                  <span className="font-medium">Explore</span>
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => onSelect(ALL_TOPICS)}
            className="group flex items-center gap-3 px-8 py-4 rounded-2xl !bg-[#151b2b] border border-white/5 hover:border-white/20 text-gray-300 hover:!text-white transition-all duration-300"
          >
            <AllIcon size={18} />
            <span className="font-medium">{allLabel}</span>
            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicGate;
