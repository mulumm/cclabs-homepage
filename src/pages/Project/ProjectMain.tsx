import { useEffect, useMemo, useState, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import type { ProjectData } from '../../types';
import ProjectList from './ProjectList';
import ProjectDetail from './ProjectDetail';

const ProjectPage = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const modules = import.meta.glob<{ default: ProjectData }>('../../assets/data/project/*.json', { eager: true });
        const loaded: ProjectData[] = [];
        for (const [, m] of Object.entries(modules)) {
          const data = (m as { default: ProjectData }).default;
          loaded.push(data);
        }
        loaded.sort((a, b) => (new Date(b.start_date || '').getTime() || 0) - (new Date(a.start_date || '').getTime() || 0));
        setProjects(loaded);
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // URL hash 변경 감지
  useEffect(() => {
    const handleHash = () => {
      try {
        const h = window.location.hash || '';
        if (h.startsWith('#project:')) {
          const v = decodeURIComponent(h.slice('#project:'.length));
          if (v.startsWith('detail:')) {
            const title = decodeURIComponent(v.slice('detail:'.length));
            setSelectedProject(title || null);
            setSelectedStatus(null);
          } else {
            setSelectedStatus(v || null);
            setSelectedProject(null);
          }
        }
      } catch {
        // ignore
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const filterBy = useCallback((statusName: string, prog?: string) => {
    return projects.filter((p) => 
      (p.status || '').toLowerCase() === statusName.toLowerCase() && 
      (prog ? (p.progress_status || '').toLowerCase() === prog.toLowerCase() : true)
    );
  }, [projects]);

  const govProgress = useMemo(() => filterBy('Government projects', 'progress').slice(0, 5), [filterBy]);
  const govCompleted = useMemo(() => filterBy('Government projects', 'completed').slice(0, 5), [filterBy]);

  const indProgress = useMemo(() => filterBy('Industry Collaboration', 'progress').slice(0, 5), [filterBy]);
  const indCompleted = useMemo(() => filterBy('Industry Collaboration', 'completed').slice(0, 5), [filterBy]);

  const stats = useMemo(() => {
    const gov = projects.filter((p) => (p.status || '').toLowerCase() === 'government projects').length;
    const ind = projects.filter((p) => (p.status || '').toLowerCase() === 'industry collaboration').length;
    const ongoing = projects.filter((p) => (p.progress_status || '').toLowerCase() === 'progress').length;
    const completed = projects.filter((p) => (p.progress_status || '').toLowerCase() === 'completed').length;
    return { gov, ind, ongoing, completed };
  }, [projects]);

  const formatDate = (s?: string) => s || '';

  if (selectedProject) {
    return <ProjectDetail projectTitle={selectedProject} onBack={() => setSelectedProject(null)} />;
  }

  if (selectedStatus) {
    return <ProjectList statusFilter={selectedStatus} onBack={() => setSelectedStatus(null)} onOpen={(title) => setSelectedProject(title)} />;
  }

  return (
    // [설정 1] color-scheme: dark 및 배경색/글자색 강제 고정
    <div 
      className="w-full !bg-[#0f1420] pt-32 pb-24 min-h-screen !text-white"
      style={{ colorScheme: 'dark' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-[#4dabf7] font-semibold tracking-widest uppercase text-lg mb-3">Research Portfolio</h2>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight !text-white">Projects</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">Our ongoing and completed research projects</p>
        </div>

        <div className="space-y-16">
          {/* Government Projects */}
          <div className="group relative !bg-[#151b2b] rounded-3xl p-8 md:p-10 border border-white/5 hover:border-[#4dabf7]/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#4dabf7]/10 rounded-2xl flex items-center justify-center mr-4 border border-[#4dabf7]/20">
                  <svg className="w-6 h-6 text-[#4dabf7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold !text-white">Government Projects</h2>
              </div>
              
              <button 
                onClick={() => setSelectedStatus('Government projects')} 
                className="flex items-center gap-2 text-[#4dabf7] hover:!text-white transition-colors group px-4 py-2 rounded-lg bg-gray-500/10 hover:bg-gray-500/20"
              >
                <span className="font-medium">View All</span>
                <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              
              {/* Ongoing */}
              <div className="bg-transparent">
                <h3 className="text-xl font-bold !text-white mb-6 border-b border-[#4dabf7] pb-3 inline-block">Ongoing</h3>
                <div className="space-y-2">W
                  {loading ? <p className="text-gray-400">Loading...</p> : govProgress.length === 0 ? <p className="text-gray-400">No projects</p> : govProgress.map((p) => (
                    <button key={p.title} onClick={() => setSelectedProject(p.title)} className="w-full text-left group/item appearance-none focus:outline-none bg-transparent">
                      {/* [수정] 배경색 #121723 강제 적용 */}
                      <div 
                        className="p-4 rounded-lg border border-white/5 transition-all hover:border-[#4dabf7]/30"
                        style={{ backgroundColor: '#121723' }}
                      >
                        <h4 className="font-bold !text-gray-200 group-hover/item:!text-[#4dabf7] transition-colors mb-1 truncate">{p.title}</h4>
                        {/* [수정] flex-col로 변경하여 수직 배치 */}
                        <div className="flex flex-col items-start gap-1 text-sm mt-1">
                           <p className="!text-gray-400 truncate w-full">{p.participant || ''}</p>
                           <p className="!text-gray-500 font-mono text-xs">{formatDate(p.start_date)}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Completed */}
              <div className="bg-transparent">
                <h3 className="text-xl font-bold !text-white mb-6 border-b border-gray-600 pb-3 inline-block">Completed</h3>
                <div className="space-y-2">
                  {loading ? <p className="text-gray-400">Loading...</p> : govCompleted.length === 0 ? <p className="text-gray-400">No completed</p> : govCompleted.map((p) => (
                    <button key={p.title} onClick={() => setSelectedProject(p.title)} className="w-full text-left group/item appearance-none focus:outline-none bg-transparent">
                      {/* [수정] 배경색 #121723 강제 적용 */}
                      <div 
                          className="p-4 rounded-lg border border-white/5 transition-all hover:border-[#4dabf7]/30"
                          style={{ backgroundColor: '#121723' }}
                      >
                        <h4 className="font-bold !text-gray-300 group-hover/item:!text-white transition-colors mb-1 truncate">{p.title}</h4>
                         {/* [수정] flex-col로 변경하여 수직 배치 */}
                         <div className="flex flex-col items-start gap-1 text-sm mt-1">
                           <p className="!text-gray-500 truncate w-full">{p.participant || ''}</p>
                           <p className="!text-gray-600 font-mono text-xs">{formatDate(p.start_date)}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Industry Collaboration */}
          <div className="group relative !bg-[#151b2b] rounded-3xl p-8 md:p-10 border border-white/5 hover:border-green-500/30 transition-all duration-300">
             <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mr-4 border border-green-500/20">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold !text-white">Industry Collaboration</h2>
              </div>
              
              <button 
                onClick={() => setSelectedStatus('Industry Collaboration')} 
                className="flex items-center gap-2 text-green-400 hover:!text-white transition-colors group px-4 py-2 rounded-lg bg-gray-500/10 hover:bg-gray-500/20"
              >
                <span className="font-medium">View All</span>
                <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Ongoing */}
              <div className="bg-transparent">
                <h3 className="text-xl font-bold !text-white mb-6 border-b border-green-500 pb-3 inline-block">Ongoing</h3>
                <div className="space-y-2">
                  {loading ? <p className="text-gray-400">Loading...</p> : indProgress.length === 0 ? <p className="text-gray-400">No projects</p> : indProgress.map((p) => (
                    <button key={p.title} onClick={() => setSelectedProject(p.title)} className="w-full text-left group/item appearance-none focus:outline-none bg-transparent">
                        {/* [수정] 배경색 #121723 강제 적용 */}
                        <div 
                         className="p-4 rounded-lg border border-white/5 transition-all hover:border-green-400/30"
                         style={{ backgroundColor: '#121723' }}
                       >
                         <h4 className="font-bold !text-gray-200 group-hover/item:!text-green-400 transition-colors mb-1 truncate">{p.title}</h4>
                          {/* [수정] flex-col로 변경하여 수직 배치 */}
                          <div className="flex flex-col items-start gap-1 text-sm mt-1">
                           <p className="!text-gray-400 truncate w-full">{p.participant || ''}</p>
                           <p className="!text-gray-500 font-mono text-xs">{formatDate(p.start_date)}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Completed */}
              <div className="bg-transparent">
                <h3 className="text-xl font-bold !text-white mb-6 border-b border-gray-600 pb-3 inline-block">Completed</h3>
                <div className="space-y-2">
                  {loading ? <p className="text-gray-400">Loading...</p> : indCompleted.length === 0 ? <p className="text-gray-400">No completed</p> : indCompleted.map((p) => (
                    <button key={p.title} onClick={() => setSelectedProject(p.title)} className="w-full text-left group/item appearance-none focus:outline-none bg-transparent">
                        {/* [수정] 배경색 #121723 강제 적용 */}
                        <div 
                         className="p-4 rounded-lg border border-white/5 transition-all hover:border-green-400/30"
                         style={{ backgroundColor: '#121723' }}
                        >
                         <h4 className="font-bold !text-gray-300 group-hover/item:!text-white transition-colors mb-1 truncate">{p.title}</h4>
                          {/* [수정] flex-col로 변경하여 수직 배치 */}
                          <div className="flex flex-col items-start gap-1 text-sm mt-1">
                           <p className="!text-gray-500 truncate w-full">{p.participant || ''}</p>
                           <p className="!text-gray-600 font-mono text-xs">{formatDate(p.start_date)}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 통계 섹션 */}
        <div className="mt-20 relative overflow-hidden bg-gradient-to-r from-[#1a2333] to-[#151b2b] rounded-3xl border border-white/5 p-8 md:p-12">
          <h2 className="text-3xl font-bold !text-white mb-12 text-center">Project Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#4dabf7] mb-4">{stats.gov}</div>
              <p className="text-gray-400 text-lg">Government Projects</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-400 mb-4">{stats.ind}</div>
              <p className="text-gray-400 text-lg">Industry Projects</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-4">{stats.ongoing}</div>
              <p className="text-gray-400 text-lg">Ongoing Projects</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-4">{stats.completed}</div>
              <p className="text-gray-400 text-lg">Completed Projects</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;