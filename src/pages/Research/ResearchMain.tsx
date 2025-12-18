import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Globe, BookOpen, Users, Award, Calendar } from 'lucide-react';
import type { ResearchData } from '../../types';
import ResearchList from './ResearchList';
import ResearchDetail from './ResearchDetail';

// [수정됨] 순서 변경: International이 먼저 나오도록 수정
const CATEGORIES = [
  'International conference',
  'International journal',
  'Korean academic conference',
  'Korean journal'
] as const;

// 카테고리별 테마 색상 및 아이콘 정의
const THEMES: Record<string, { color: string, bg: string, border: string, icon: React.ReactNode }> = {
  'International conference': { 
    color: 'text-purple-400', 
    bg: 'bg-purple-400/10', 
    border: 'border-purple-400/20',
    icon: <Globe size={24} />
  },
  'International journal': { 
    color: 'text-orange-400', 
    bg: 'bg-orange-400/10', 
    border: 'border-orange-400/20',
    icon: <Award size={24} />
  },
  'Korean academic conference': { 
    color: 'text-blue-400', 
    bg: 'bg-blue-400/10', 
    border: 'border-blue-400/20',
    icon: <Users size={24} />
  },
  'Korean journal': { 
    color: 'text-green-400', 
    bg: 'bg-green-400/10', 
    border: 'border-green-400/20',
    icon: <BookOpen size={24} /> 
  }
};

const ResearchPage = () => {
  const [items, setItems] = useState<ResearchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedResearch, setSelectedResearch] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const modules = import.meta.glob<{ default: ResearchData }>('../../assets/data/research/*.json', { eager: true });
        const loaded: ResearchData[] = [];
        for (const [, m] of Object.entries(modules)) {
          const data = (m as { default: ResearchData }).default;
          loaded.push(data);
        }
        const dateValue = (r?: ResearchData) => {
          const d = r?.date;
          return (d?.publish || d?.accept || d?.submit || d?.prepare || '') as string;
        };
        loaded.sort((a, b) => (new Date(dateValue(b)).getTime() || 0) - (new Date(dateValue(a)).getTime() || 0));
        setItems(loaded);
      } catch (error) {
        console.error('Failed to load research data:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Read URL hash to support header-driven category selection
  useEffect(() => {
    const handleHash = () => {
      try {
        const h = window.location.hash || '';
        if (h.startsWith('#research:')) {
          const v = decodeURIComponent(h.slice('#research:'.length));
          setSelectedCategory(v || null);
        }
      } catch {
        // ignore
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const filterBy = (status: string) => items.filter((i) => (i.status || '').toLowerCase() === status.toLowerCase());
  const categoryItems = (cat: string) => filterBy(cat).slice(0, 3);

  const stats = useMemo(() => {
    const counts = CATEGORIES.reduce((acc: Record<string, number>, c) => {
      acc[c] = items.filter((i) => (i.status || '').toLowerCase() === c.toLowerCase()).length;
      return acc;
    }, {} as Record<string, number>);
    return { counts };
  }, [items]);

  if (selectedResearch) {
    return <ResearchDetail researchTitle={selectedResearch} onBack={() => setSelectedResearch(null)} />;
  }

  if (selectedCategory) {
    return <ResearchList statusFilter={selectedCategory} onBack={() => setSelectedCategory(null)} onOpen={(title) => setSelectedResearch(title)} />;
  }

  return (
    <div className="w-full bg-[#0f1420] pt-32 pb-24 min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-[#4dabf7] font-semibold tracking-widest uppercase text-lg mb-3">Academic Publications</h2>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white">Research</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">Let me introduce the academic papers and research results of our lab</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {CATEGORIES.map((cat) => {
            const theme = THEMES[cat] || { color: 'text-white', bg: 'bg-white/10', border: 'border-white/20', icon: null };
            
            return (
              <div 
                key={cat} 
                className={`group relative bg-[#151b2b] rounded-3xl p-8 md:p-10 border border-white/5 hover:border-opacity-50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}
                style={{ borderColor: 'rgba(255,255,255,0.05)' }} 
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme.bg} ${theme.border} border`}>
                      <span className={`${theme.color}`}>{theme.icon}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white leading-tight max-w-[200px]">{cat}</h2>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedCategory(cat)} 
                    className={`flex items-center gap-2 ${theme.color} hover:text-white transition-colors group/btn`}
                  >
                    <span className="font-medium text-sm">View All</span>
                    <ArrowRight size={16} className="transform group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* List Items */}
                <div className="space-y-3">
                  {loading ? (
                    <div className="text-gray-400 text-sm">Loading...</div>
                  ) : categoryItems(cat).length === 0 ? (
                    <div className="text-gray-500 text-sm py-2">No publications yet.</div>
                  ) : (
                    categoryItems(cat).map((it) => (
                      <button 
                        key={it.title} 
                        onClick={() => setSelectedResearch(it.title)} 
                        className="w-full text-left group/item"
                      >
                        <div className={`py-3 border-b border-white/5 hover:border-opacity-50 transition-colors`}>
                          <h4 className={`font-bold text-gray-200 group-hover/item:text-white transition-colors mb-2 truncate text-base`}>
                            {it.title}
                          </h4>
                          <div className="flex flex-col items-start gap-1 text-xs text-gray-500">
                            <div className="flex items-center gap-2 w-full min-w-0">
                                <Users size={12} className="flex-shrink-0" />
                                <p className="truncate">{it.authors || 'No authors'}</p>
                            </div>
                            {(it.date?.publish || it.date?.accept || it.date?.submit || it.date?.prepare) && (
                                <div className="flex items-center gap-2 font-mono">
                                    <Calendar size={12} />
                                    <span>{it.date?.publish || it.date?.accept || it.date?.submit || it.date?.prepare}</span>
                                </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Statistics Section (수정됨) */}
        <div className="mt-20 relative overflow-hidden bg-gradient-to-r from-[#1a2333] to-[#151b2b] rounded-3xl border border-white/5 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Research Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {CATEGORIES.map((c) => {
               const theme = THEMES[c];
               return (
                <div key={c} className="text-center group flex flex-col items-center justify-center h-full">
                  <div className={`text-3xl md:text-4xl font-bold mb-3 ${theme.color} group-hover:scale-110 transition-transform duration-300`}>
                    {stats.counts[c] ?? 0}
                  </div>
                  {/* [수정됨] 명칭 그대로 사용 (replace 제거) */}
                  <p className="text-gray-400 text-xs uppercase tracking-wider text-center max-w-[150px] leading-relaxed">
                    {c}
                  </p>
                </div>
               );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResearchPage;