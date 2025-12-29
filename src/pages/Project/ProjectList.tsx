import { useEffect, useMemo, useState, useRef } from 'react';
import { ChevronLeft, ArrowRight, Calendar, User, Search, ChevronDown } from 'lucide-react';
import type { ProjectData } from '../../types';
import ProjectDetail from './ProjectDetail';

type Props = {
  statusFilter: string;
  onBack: () => void;
  onOpen: (title: string) => void;
};

type SearchCategory = 'title' | 'content' | 'participants' | 'title+content';

const SEARCH_CATEGORIES: { key: SearchCategory, label: string }[] = [
    { key: 'title', label: '제목' },
    { key: 'content', label: '내용' },
    { key: 'participants', label: '참여 인원' },
    { key: 'title+content', label: '제목+내용' },
];

const ProjectList = ({ statusFilter, onBack }: Props) => {
  const [items, setItems] = useState<ProjectData[]>([]);
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
        const modules = import.meta.glob<{ default: ProjectData }>('../../assets/data/project/*.json', { eager: true });
        const loaded: ProjectData[] = Object.values(modules).map(m => m.default);
        loaded.sort((a, b) => (new Date(b.start_date || '').getTime() || 0) - (new Date(a.start_date || '').getTime() || 0));
        setItems(loaded);
      } catch (error) {
        console.error('Failed to load project list:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredItems = useMemo(() => {
    const statusFiltered = items.filter((p) => (p.status || '').toLowerCase() === statusFilter.toLowerCase());

    if (!searchTerm) {
      return statusFiltered;
    }

    const lowercasedTerm = searchTerm.toLowerCase();

    return statusFiltered.filter((it) => {
      const content = `${it.project_method || ''} ${it.project_target || ''} ${it.abstract || ''}`.toLowerCase();
      switch (searchCategory) {
        case 'title':
          return it.title.toLowerCase().includes(lowercasedTerm);
        case 'content':
          return content.includes(lowercasedTerm);
        case 'participants':
          return (it.participant || '').toLowerCase().includes(lowercasedTerm);
        case 'title+content':
          return it.title.toLowerCase().includes(lowercasedTerm) || content.includes(lowercasedTerm);
        default:
          return true;
      }
    });
  }, [items, statusFilter, searchTerm, searchCategory]);

  if (selected) {
    return <ProjectDetail projectTitle={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="w-full bg-[#0f1420] pt-32 pb-24 min-h-screen text-white">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-6">
          <div>
            <span className="text-[#4dabf7] text-sm font-bold tracking-widest uppercase mb-1 block">Project List</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{statusFilter}</h1>
          </div>
          <button 
            onClick={onBack} 
            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-full bg-gray-500/10 hover:bg-gray-500/20"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
        </div>

        {/* Search Section */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
            {/* 드롭다운 영역 */}
            <div className="relative w-full sm:w-48" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    // [수정] 배경색(!bg-[#151b2b])과 텍스트(!text-white) 강제 고정
                    className="w-full !bg-[#151b2b] !text-white border border-white/10 rounded-lg px-4 py-2 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#4dabf7]"
                >
                    <span>
                        {SEARCH_CATEGORIES.find(c => c.key === searchCategory)?.label}
                    </span>
                    <ChevronDown className={`transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} size={16} />
                </button>

                {isDropdownOpen && (
                    // [수정] 드롭다운 메뉴 배경(!bg-[#1c2436]) 및 z-index(z-50) 설정
                    <div className="absolute z-50 top-full mt-2 w-full !bg-[#1c2436] border border-white/10 rounded-lg shadow-xl overflow-hidden">
                        <ul className="py-1">
                            {SEARCH_CATEGORIES.map(({ key, label }) => (
                                <li key={key}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchCategory(key);
                                            setIsDropdownOpen(false);
                                        }}
                                        // [수정] 항목 배경 투명(!bg-transparent) -> hover 시 색상 변경 로직 적용
                                        className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 
                                            ${searchCategory === key 
                                                ? '!bg-[#4dabf7] !text-[#0f1420] font-medium' 
                                                : '!bg-transparent !text-gray-200 hover:!bg-[#252f45] hover:!text-white'
                                            }`}
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
                    // [수정] input 배경(!bg-[#151b2b]) 강제 고정
                    className="w-full !bg-[#151b2b] !text-white border border-white/10 rounded-lg pl-10 pr-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4dabf7]"
                />
            </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4dabf7] mx-auto mb-4"></div>
            <p className="text-gray-400">Loading projects...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-[#151b2b] rounded-3xl border border-white/5">
            <p className="text-gray-400">{searchTerm ? '검색 결과가 없습니다.' : '해당 카테고리에 프로젝트가 없습니다.'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((p, idx) => (
              <button 
                key={p.title + idx} 
                onClick={() => setSelected(p.title)}
                // [수정] 리스트 아이템 배경(!bg-[#151b2b]) 강제 고정
                className="w-full text-left group relative !bg-[#151b2b] rounded-2xl p-6 md:p-8 border border-white/5 hover:border-[#4dabf7]/30 transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded bg-white/5 text-xs text-gray-500 font-mono">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      {p.start_date && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono bg-[#0f1420] px-2 py-1 rounded">
                          <Calendar size={12} />
                          {p.start_date}
                        </div>
                      )}
                    </div>
                    
                    {/* [수정] 제목 텍스트 색상(!text-white) 강제 고정 */}
                    <h3 className="text-xl md:text-2xl font-bold !text-white mb-2 group-hover:!text-[#4dabf7] transition-colors truncate pr-4">
                      {p.title}
                    </h3>
                    
                    <div className="flex flex-col items-start gap-2 mt-3">
                      {p.PI && (
                        <div className="flex items-center gap-2">
                          <span className="bg-gray-700 text-gray-300 text-xs font-semibold px-2 py-1 rounded-full">Principal Investigator</span>
                          <span className="text-gray-200 font-bold">{p.PI}</span>
                        </div>
                      )}
                      {p.participant && (
                        <div className="flex items-center gap-2">
                           <span className="bg-gray-800 text-gray-400 text-xs font-semibold px-2 py-1 rounded-full">Participants</span>
                           <span className="text-gray-400 truncate">{p.participant}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5 mt-4 md:mt-0">
                    <div 
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-[#4dabf7]/10 text-[#4dabf7] border border-[#4dabf7]/20 group-hover:bg-[#4dabf7] group-hover:text-[#0f1420] transition-all duration-300"
                    >
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

export default ProjectList;