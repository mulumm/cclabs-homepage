import { useEffect, useState } from 'react';
import PatentDetail from './PatentDetail';
import type { PatentData } from '../../types';
import { FileText, Award, Calendar, Hash, Building2, ChevronRight } from 'lucide-react';

const PatentPage = () => {
  const [patents, setPatents] = useState<PatentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatent, setSelectedPatent] = useState<string | null>(null);

  useEffect(() => {
    const loadPatents = async () => {
      try {
        const patentModules = import.meta.glob<{ default: PatentData }>(
          '../../assets/data/patent/*.json',
          { eager: true }
        );

        const loadedPatents: PatentData[] = [];

        for (const [, module] of Object.entries(patentModules)) {
          try {
            const data = module.default;
            // [오류 수정] PatentData 인터페이스에 정의된 모든 필수 필드를 포함해야 합니다.
            loadedPatents.push({
              title: data.title,
              patent_num: data.patent_num,
              date: data.date,
              associate: data.associate,
              abstract: data.abstract || "" // abstract가 누락되지 않도록 추가
            });
          } catch (error) {
            console.error('Failed to process patent data:', error);
          }
        }

        // 최신순 정렬
        loadedPatents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setPatents(loadedPatents);
      } catch (error) {
        console.error('Failed to load patents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPatents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\.$/, ""); // 마지막 점 제거
  };

  return (
    <>
      {selectedPatent ? (
        <PatentDetail 
          patentTitle={selectedPatent} 
          onBack={() => setSelectedPatent(null)}
        />
      ) : (
        <div className="w-full bg-[#0f1420] pt-32 pb-24 min-h-screen text-white selection:bg-[#4dabf7]/30">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            {/* Header Section */}
            <div className="text-center mb-24">
              <h2 className="text-[#4dabf7] font-semibold tracking-[0.3em] uppercase text-sm mb-4">Intellectual Property</h2>
              <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-white leading-tight">
                Patents
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                현재 CCLabs에서 보유 및 출원 중인 <br className="hidden md:block" />
                지식재산권 현황입니다.
              </p>
            </div>

            <div className="space-y-24">
              {/* 등록 특허 리스트 */}
              <div className="relative">
                <div className="flex items-center gap-4 mb-12">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  <div className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#151b2b] border border-white/10 shadow-xl">
                    <Award size={18} className="text-[#4dabf7]" />
                    <span className="text-sm font-bold tracking-widest text-gray-200">REGISTERED LIST</span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                </div>
                
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <div className="w-10 h-10 border-2 border-[#4dabf7]/20 border-t-[#4dabf7] rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-light">Loading intellectual assets...</p>
                  </div>
                ) : patents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {patents.map((patent, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedPatent(patent.title)}
                        className="group relative bg-[#151b2b] rounded-3xl p-8 border border-white/5 hover:border-[#4dabf7]/40 transition-all duration-500 text-left overflow-hidden shadow-2xl hover:-translate-y-2"
                      >
                        {/* Hover Gradient Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#4dabf7]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="relative z-10 flex flex-col h-full">
                          <div className="flex justify-between items-start mb-6">
                            <div className="p-3 rounded-2xl bg-[#0f1420] border border-white/5 group-hover:border-[#4dabf7]/30 transition-colors">
                              <FileText className="text-[#4dabf7]" size={24} />
                            </div>
                            <ChevronRight size={20} className="text-gray-600 group-hover:text-[#4dabf7] group-hover:translate-x-1 transition-all" />
                          </div>

                          <h3 className="text-xl font-bold text-white mb-6 group-hover:text-[#4dabf7] transition-colors line-clamp-2 leading-snug">
                            {patent.title}
                          </h3>

                          <div className="mt-auto space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                              <Hash size={14} className="text-gray-600" />
                              <span className="font-mono">{patent.patent_num}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                              <Building2 size={14} className="text-gray-600" />
                              <span>{patent.associate}</span>
                            </div>
                            <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-[12px] font-mono text-gray-500">
                              <Calendar size={12} />
                              <span>Registered at {formatDate(patent.date)}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-24 bg-[#151b2b] rounded-3xl border border-dashed border-white/10">
                    <p className="text-gray-500 italic">등록된 특허 내역이 없습니다.</p>
                  </div>
                )}
              </div>

              {/* 통계 섹션 */}
              <div className="flex justify-center pb-20">
                <div className="w-full max-w-3xl relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#4dabf7]/20 to-purple-500/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                  <div className="relative bg-[#151b2b] rounded-[2rem] border border-white/10 p-12 md:p-16 overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                      <Award size={120} />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-around gap-12">
                      <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold text-white mb-2"> CCLabs Patent Status</h2>
                        <p className="text-gray-500 font-light">CCLabs의 지식재산권을 바탕으로 기술 혁신을 이어갑니다.</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-7xl font-black text-[#4dabf7] mb-2 tracking-tighter">
                          {patents.length}
                        </div>
                        <div className="px-4 py-1 rounded-full bg-[#4dabf7]/10 border border-[#4dabf7]/20 text-[#4dabf7] text-xs font-bold tracking-widest uppercase">
                          Assets
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PatentPage;