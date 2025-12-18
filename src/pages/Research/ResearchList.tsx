import React, { useEffect, useMemo, useState, useRef } from 'react';
import { ChevronLeft, ArrowRight, BookOpen, Users, Calendar, Search, ChevronDown } from 'lucide-react';
import type { ResearchData } from '../../types';
import ResearchDetail from './ResearchDetail';

type Props = {
  statusFilter: string;
  onBack?: () => void;
  onOpen?: (title: string) => void;
};

type SearchCategory = 'title' | 'abstract' | 'authors' | 'title+abstract';

const SEARCH_CATEGORIES: { key: SearchCategory, label: string }[] = [
    { key: 'title', label: '제목' },
    { key: 'abstract', label: '내용' },
    { key: 'authors', label: '저자' },
    { key: 'title+abstract', label: '제목+내용' },
];

const ResearchList: React.FC<Props> = ({ statusFilter, onBack }) => {
  const [items, setItems] = useState<ResearchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState<SearchCategory>('title');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    const load = async () => {
      try {
        const modules = import.meta.glob<{ default: ResearchData }>('../../assets/data/research/*.json', { eager: true });
        const loaded: ResearchData[] = Object.values(modules).map((m) => (m as { default: ResearchData }).default);
        loaded.sort((a, b) => {
          const da = a.date?.publish || a.date?.accept || a.date?.submit || a.date?.prepare || '';
          const db = b.date?.publish || b.date?.accept || b.date?.submit || b.date?.prepare || '';
          return (new Date(db).getTime() || 0) - (new Date(da).getTime() || 0);
        });
        setItems(loaded);
      } catch (error) {
        console.error('Failed to load research list:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const statusFiltered = items.filter((it) => (it.status || '').toLowerCase() === statusFilter.toLowerCase());

    if (!searchTerm) {
        return statusFiltered;
    }

    const lowercasedTerm = searchTerm.toLowerCase();

    return statusFiltered.filter((it) => {
        switch (searchCategory) {
            case 'title':
                return it.title.toLowerCase().includes(lowercasedTerm);
            case 'abstract':
                return (it.abstract || '').toLowerCase().includes(lowercasedTerm);
            case 'authors':
                return (it.authors || '').toLowerCase().includes(lowercasedTerm);
            case 'title+abstract':
                return (
                    it.title.toLowerCase().includes(lowercasedTerm) ||
                    (it.abstract || '').toLowerCase().includes(lowercasedTerm)
                );
            default:
                return true;
        }
    });
  }, [items, statusFilter, searchTerm, searchCategory]);

  if (selected) {
    return <ResearchDetail researchTitle={selected} onBack={() => setSelected(null)} />;
  }

  return (
    // style={{ colorScheme: 'dark' }} : 브라우저가 강제로 라이트 모드 스타일(흰 배경 등)을 입히는 것을 방지
    <div 
      className="w-full bg-[#0f1420] pt-32 pb-24 min-h-screen text-white"
      style={{ colorScheme: 'dark' }} 
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-6">
          <div>
            <span className="text-[#4dabf7] text-sm font-bold tracking-widest uppercase mb-1 block">Publication List</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{statusFilter}</h1>
          </div>
          {onBack && (
            <button 
              onClick={onBack} 
              className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-full bg-gray-500/10 hover:bg-gray-500/20"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span>back</span>
            </button>
          )}
        </div>

        {/* Search Section */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full sm:w-48" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    // !bg-[#151b2b] : 느낌표(!)를 사용하여 외부 스타일보다 우선순위를 높임
                    className="w-full !bg-[#151b2b] border border-white/10 rounded-lg px-4 py-2 text-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#4dabf7]"
                >
                    <span>
                        {SEARCH_CATEGORIES.find(c => c.key === searchCategory)?.label}
                    </span>
                    <ChevronDown className={`transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} size={16} />
                </button>

                {isDropdownOpen && (
                    <div className="absolute z-10 top-full mt-2 w-full bg-[#1c2436] border border-white/10 rounded-lg shadow-lg overflow-hidden">
                        <ul className="py-1">
                            {SEARCH_CATEGORIES.map(({ key, label }) => (
                                <li key={key}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchCategory(key);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${searchCategory === key ? 'bg-[#4dabf7] text-[#0f1420]' : 'text-gray-200 hover:bg-[#4dabf7]/20'}`}
                                    >
                                        {label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="relative flex-grow w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="text-gray-400" size={20} />
                </div>
                <input
                    type="text"
                    placeholder={`'${SEARCH_CATEGORIES.find(c => c.key === searchCategory)?.label}'에서 검색...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    // !bg-[#151b2b] 및 !text-white로 강제 고정
                    className="w-full !bg-[#151b2b] !text-white border border-white/10 rounded-lg pl-10 pr-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4dabf7]"
                />
            </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4dabf7] mx-auto mb-4"></div>
            <p className="text-gray-400">Loading publications...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-[#151b2b] rounded-3xl border border-white/5">
            <p className="text-gray-400">{searchTerm ? '검색 결과가 없습니다.' : '해당 카테고리에 연구 결과가 없습니다.'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((it, idx) => (
              <button 
                key={it.title + idx} 
                onClick={() => setSelected(it.title)}
                // !bg-[#121723] : 글로벌 스타일 오버라이딩 방지. 어두운 배경 고정.
                className="w-full text-left group relative !bg-[#121723] rounded-2xl p-6 md:p-8 border border-white/5 hover:border-[#4dabf7]/30 transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  {/* Left: Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded bg-white/5 text-xs text-gray-500 font-mono">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      {it.scholarly_society && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono bg-[#0f1420] px-2 py-1 rounded truncate max-w-[200px]">
                          <BookOpen size={12} />
                          <span className="truncate">{it.scholarly_society}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* !text-white: 텍스트 색상도 강제로 하얀색 고정 */}
                    <h3 className="text-xl font-bold !text-white mb-2 group-hover:!text-[#4dabf7] transition-colors line-clamp-2">
                      {it.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
                      <div className="flex items-center gap-2 min-w-0">
                        <Users size={14} className="text-gray-500 shrink-0" />
                        <p className="truncate">{it.authors || 'No authors listed'}</p>
                      </div>
                      {(it.date?.publish || it.date?.accept || it.date?.submit || it.date?.prepare) && (
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-500 shrink-0" />
                          <span>{it.date?.publish || it.date?.accept || it.date?.submit || it.date?.prepare}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5 mt-4 md:mt-0">
                    <div className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-[#4dabf7]/10 text-[#4dabf7] border border-[#4dabf7]/20 group-hover:bg-[#4dabf7] group-hover:text-[#0f1420] transition-all duration-300">
                      <span>Detail</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchList;