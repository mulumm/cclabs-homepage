import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronRight, Dna, ScanEye, ChartNoAxesCombined, Newspaper, Briefcase } from 'lucide-react'; // 아이콘 추가
import Footer from '../../components/layout/Footer';
import type { NewsData, ProjectData } from '../../types';

const MainPage = () => {
  const [page, setPage] = useState(0); 
  const [isScrolling, setIsScrolling] = useState(false); 
  const touchStartY = useRef(0); 

  const TOTAL_PAGES = 4; 

  const [latestNews, setLatestNews] = useState<NewsData[]>([]);
  const [latestProjects, setLatestProjects] = useState<ProjectData[]>([]);

  // [수정] 날짜 포맷팅 함수 개선
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // 유효하지 않은 날짜면 원본 문자열 반환
    if (isNaN(date.getTime())) return dateString;
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }).format(date).toUpperCase(); // 예: JUL 24, 2025
  };

  useEffect(() => {
    const load = async () => {
      try {
        const newsModules = import.meta.glob<{ default: NewsData }>('../../assets/data/news/*.json', { eager: true });
        const newsLoaded: NewsData[] = Object.values(newsModules).map((m) => (m as { default: NewsData }).default);
        newsLoaded.sort((a, b) => (new Date(b.date).getTime() || 0) - (new Date(a.date).getTime() || 0));
        setLatestNews(newsLoaded.slice(0, 3));

        const projModules = import.meta.glob<{ default: ProjectData }>('../../assets/data/project/*.json', { eager: true });
        const projLoaded: ProjectData[] = Object.values(projModules).map((m) => (m as { default: ProjectData }).default);
        projLoaded.sort((a, b) => (new Date(b.start_date || '').getTime() || 0) - (new Date(a.start_date || '').getTime() || 0));
        setLatestProjects(projLoaded.slice(0, 3));
      } catch (err) {
        console.error('Failed to load main page data', err);
      }
    };

    load();
  }, []);

  const changePage = useCallback((direction: 'up' | 'down') => {
    if (isScrolling) return;

    if (direction === 'down' && page < TOTAL_PAGES - 1) {
      setPage((prev) => prev + 1);
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 1200); 
    } else if (direction === 'up' && page > 0) {
      setPage((prev) => prev - 1);
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 1200);
    }
  }, [page, isScrolling]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        changePage('down');
      } else {
        changePage('up');
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [changePage]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const distance = touchStartY.current - touchEndY;

    if (Math.abs(distance) > 50) { 
      if (distance > 0) {
        changePage('down'); 
      } else {
        changePage('up'); 
      }
    }
  };

  // 공통 네비게이션 핸들러 (오류 수정됨)
  const handleNavClick = (hash: string) => {
    try {
      window.location.hash = hash;
    } catch {
      // 오류 발생 시 무시 ('e' 제거하여 ESLint 오류 해결)
    }
  };

  return (
    <div 
      className="fixed inset-0 w-full h-screen bg-[#0f1420] text-white overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      
      <div 
        className="w-full h-full transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateY(-${page * 100}vh)` }}
      >
        {/* --- 1. Hero Section (Page 0) --- */}
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=2070&auto=format&fit=crop"
          >
            <source src="/main_video.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-[#0f1420]/50 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1420] via-transparent to-transparent"></div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 mt-20 text-center md:text-left">
            <div className="max-w-4xl animate-fade-in-up">
              <h1 className="text-5xl md:text-8xl font-bold mb-8 leading-tight tracking-tight">
                Cognitive Computing<br/>
                <span className="text-[#4dabf7]">Labs</span>
              </h1>
              <p className="text-xl md:text-2xl font-light text-gray-300 mb-10 leading-relaxed max-w-2xl">
                Our lab conducts research across diverse areas of computer science, including Bio-AI, Computer Vision, and Data Analysis,<br className="hidden md:block"/>with the goal of developing practical AI technologies.
              </p>
            </div>
          </div>
          
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-gray-500 cursor-pointer" onClick={() => setPage(1)}>
             <span className="text-xl tracking-widest uppercase">Scroll Down</span>
          </div>
        </section>


        {/* --- 2. News & Projects (Page 1 - Redesigned) --- */}
        <section className="w-full h-screen flex items-center bg-[#0f1420] border-t border-white/5 relative">
          {/* 배경 장식 요소 */}
          <div className="absolute top-1/4 left-0 w-1/2 h-1/2 bg-[#4dabf7]/5 blur-[160px] pointer-events-none rounded-full"></div>
          <div className="absolute bottom-1/4 right-0 w-1/3 h-1/3 bg-emerald-500/5 blur-[140px] pointer-events-none rounded-full"></div>

          <div className="max-w-7xl w-full mx-auto px-6 md:px-8 relative z-10">
            {/* items-start를 사용하여 두 컬럼의 시작점을 상단으로 고정 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
              
              {/* News Section */}
              <div className="flex flex-col w-full">
                {/* 헤더: h-24 정도로 높이를 고정하여 양쪽 섹션의 가로축을 맞춤 */}
                <div className="flex justify-between items-end h-24 pb-6 border-b border-white/10 relative mb-10">
                  <div className="flex flex-col gap-1">
                    <span className="text-[#4dabf7] text-[10px] font-mono tracking-[0.3em] uppercase opacity-70">Intelligence</span>
                    <div className="flex items-center gap-3">
                      <Newspaper className="text-[#4dabf7]" size={26} />
                      <h3 className="text-3xl font-bold tracking-tight text-white leading-none">LATEST NEWS</h3>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavClick('#news:')}
                    className="text-[10px] font-bold tracking-widest text-gray-400 hover:text-[#4dabf7] flex items-center transition-all gap-2 group bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:border-[#4dabf7]/40 mb-1"
                  >
                    VIEW ALL <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                  </button>
                  <div className="absolute bottom-0 left-0 w-20 h-1 bg-[#4dabf7]"></div>
                </div>
                
                <div className="space-y-4">
                  {latestNews.map((n, i) => (
                    <button
                      key={n.title + i}
                      onClick={() => handleNavClick(`#news:detail:${encodeURIComponent(n.title)}`)}
                      className="w-full group relative text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#4dabf7]/30 transition-all duration-500 hover:bg-white/[0.04]"
                    >
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-1/2 bg-[#4dabf7] transition-all duration-500 rounded-r"></div>
                      <div className="flex flex-col gap-2">
                        <span className="text-[15px] font-mono text-[#4dabf7]/70 uppercase tracking-widest">{formatDate(n.date)}</span>
                        <h4 className="text-lg font-medium text-gray-300 group-hover:text-white transition-colors leading-snug truncate pr-8">
                          {n.title}
                        </h4>
                      </div>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                        <ChevronRight size={20} className="text-[#4dabf7]" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Projects Section */}
              <div className="flex flex-col w-full">
                {/* 헤더: News 섹션과 동일한 h-24 적용 */}
                <div className="flex justify-between items-end h-24 pb-6 border-b border-white/10 relative mb-10">
                  <div className="flex flex-col gap-1">
                    <span className="text-emerald-400 text-[10px] font-mono tracking-[0.3em] uppercase opacity-70">Development</span>
                    <div className="flex items-center gap-3">
                      <Briefcase className="text-emerald-400" size={26} />
                      <h3 className="text-3xl font-bold tracking-tight text-white leading-none">PROJECTS</h3>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavClick('#project:')}
                    className="text-[10px] font-bold tracking-widest text-gray-400 hover:text-emerald-400 flex items-center transition-all gap-2 group bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:border-emerald-400/40 mb-1"
                  >
                    VIEW ALL <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                  </button>
                  <div className="absolute bottom-0 left-0 w-20 h-1 bg-emerald-400"></div>
                </div>

                <div className="space-y-4">
                  {latestProjects.map((p, i) => (
                    <button
                      key={p.title + i}
                      onClick={() => handleNavClick(`#project:detail:${encodeURIComponent(p.title)}`)}
                      className="w-full group relative text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-400/30 transition-all duration-500 hover:bg-white/[0.04]"
                    >
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-1/2 bg-emerald-400 transition-all duration-500 rounded-r"></div>
                      <div className="flex flex-col gap-2">
                        <span className="text-[15px] font-mono text-emerald-400/70 uppercase tracking-widest">{formatDate(p.start_date)}</span>
                        <h4 className="text-lg font-medium text-gray-300 group-hover:text-white transition-colors leading-snug truncate pr-8">
                          {p.title}
                        </h4>
                      </div>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                        <ChevronRight size={20} className="text-emerald-400" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* --- 3. Research Areas (Page 2) --- */}
        <section className="w-full h-screen flex items-center bg-[#0b0f19] border-t border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#4dabf7]/5 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="max-w-7xl w-full mx-auto px-6 md:px-8 relative z-10">
            <div className="mb-16 md:mb-20 text-center md:text-left">
              <h2 className="text-[#4dabf7] font-semibold tracking-widest uppercase text-lg mb-3">Key Research Areas</h2>
              <h3 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                What We Research
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Bio AI */}
              <div className="group relative bg-[#151b2b] rounded-3xl p-8 lg:p-10 border border-white/5 hover:border-[#4dabf7]/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(77,171,247,0.1)] hover:-translate-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-[#0f1420] flex items-center justify-center text-[#4dabf7] mb-8 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                      <Dna size={32} />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4">Bio-AI</h4>
                  <p className="text-gray-400 leading-relaxed mb-8 min-h-[48px]">
                      생물학적 데이터 분석과 단백질 구조 예측 등 의료 관련 문제를 해결을 위한 AI 연구
                  </p>
                  <div className="w-full h-px bg-white/5 mb-6 group-hover:bg-[#4dabf7]/20 transition-colors"></div>
                  <div className="flex flex-wrap gap-2">
                     <span className="text-xs font-mono text-gray-500 border border-white/10 rounded px-2 py-1">#Genomics</span>
                     <span className="text-xs font-mono text-gray-500 border border-white/10 rounded px-2 py-1">#Healthcare</span>
                  </div>
              </div>

              {/* Computer Vision */}
              <div className="group relative bg-[#151b2b] rounded-3xl p-8 lg:p-10 border border-white/5 hover:border-[#4dabf7]/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(77,171,247,0.1)] hover:-translate-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-[#0f1420] flex items-center justify-center text-[#4dabf7] mb-8 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                      <ScanEye size={32} />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4">Computer Vision</h4>
                  <p className="text-gray-400 leading-relaxed mb-8 min-h-[48px]">
                      객체 인식, 비디오 분석 등 시각 지능 고도화를 위한 딥러닝 알고리즘 연구
                  </p>
                  <div className="w-full h-px bg-white/5 mb-6 group-hover:bg-[#4dabf7]/20 transition-colors"></div>
                   <div className="flex flex-wrap gap-2">
                     <span className="text-xs font-mono text-gray-500 border border-white/10 rounded px-2 py-1">#Recognition</span>
                     <span className="text-xs font-mono text-gray-500 border border-white/10 rounded px-2 py-1">#Computer Vision</span>
                  </div>
              </div>

              {/* Data Analysis */}
              <div className="group relative bg-[#151b2b] rounded-3xl p-8 lg:p-10 border border-white/5 hover:border-[#4dabf7]/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(77,171,247,0.1)] hover:-translate-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-[#0f1420] flex items-center justify-center text-[#4dabf7] mb-8 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                      <ChartNoAxesCombined size={32} />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4">Data Analysis</h4>
                  <p className="text-gray-400 leading-relaxed mb-8 min-h-[48px]">
                      대규모 데이터로부터 유의미한 패턴을 발견하고 예측 모델을 구축하는 데이터 연구
                  </p>
                  <div className="w-full h-px bg-white/5 mb-6 group-hover:bg-[#4dabf7]/20 transition-colors"></div>
                   <div className="flex flex-wrap gap-2">
                     <span className="text-xs font-mono text-gray-500 border border-white/10 rounded px-2 py-1">#BigData</span>
                     <span className="text-xs font-mono text-gray-500 border border-white/10 rounded px-2 py-1">#Prediction</span>
                  </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 4. Footer Section (Page 3) --- */}
        <section className="w-full h-screen flex flex-col justify-end bg-[#0b0f19] relative">
           <Footer />
        </section>

      </div>
      
      {/* 우측 인디케이터 */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-50">
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              page === i ? 'bg-[#4dabf7] scale-125' : 'bg-white/20 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

    </div>
  );
};

export default MainPage;