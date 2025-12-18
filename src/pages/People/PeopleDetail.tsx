import { useEffect, useState } from 'react';
// verbatimModuleSyntax 대응: 형식 전용 가져오기 분리
import type { ComponentType } from 'react';
import type { PeopleDetailData, PeopleDetailProps } from '../../types';
import { ChevronLeft, ArrowUpRight, Mail, GraduationCap, Briefcase, Target, FlaskConical } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import ProjectDetail from '../Project/ProjectDetail';
import ResearchDetail from '../Research/ResearchDetail';

// 아이콘 타입을 위한 정의
type IconType = ComponentType<LucideProps>;

const PeopleDetail = ({ personId, onBack }: PeopleDetailProps) => {
  const [person, setPerson] = useState<PeopleDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'person' | 'project' | 'research'>('person');
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [personId]);

  useEffect(() => {
    const load = async () => {
      try {
        const modules = import.meta.glob<{ default: PeopleDetailData }>(
          '../../assets/data/people/*.json',
          { eager: true }
        );

        for (const [, m] of Object.entries(modules)) {
          const data = (m as { default: PeopleDetailData }).default;
          const id = data.title || data.name;
          if (id === personId) {
            setPerson(data);
            break;
          }
        }
      } catch (err) {
        console.error('Failed to load person detail:', err);
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };

    if (view === 'person') {
        load();
    }
  }, [personId, view]);

  if (view === 'project' && selectedTitle) {
    return <ProjectDetail projectTitle={selectedTitle} onBack={() => {
        setView('person');
        setSelectedTitle(null);
    }} />;
  }

  if (view === 'research' && selectedTitle) {
      return <ResearchDetail researchTitle={selectedTitle} onBack={() => {
          setView('person');
          setSelectedTitle(null);
      }} />;
  }

  const imagePath = person?.people_image ? `/uploads/people/${person.people_image}` : null;

  if (loading || !person) {
    return (
      <div className="w-full bg-[#0f1420] pt-32 pb-24 min-h-screen text-white flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">{loading ? "Loading profile..." : "Person not found."}</p>
      </div>
    );
  }

  const InfoSection = ({ label, content, icon: Icon }: { label: string, content: string, icon?: IconType }) => (
    <div className="group border-l border-white/10 pl-6 py-2 hover:border-[#4dabf7] transition-colors duration-300">
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon size={14} className="text-[#4dabf7] opacity-70" />}
        <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-semibold">{label}</p>
      </div>
      <p className="text-lg text-gray-200 leading-relaxed whitespace-pre-wrap text-left w-full">{content}</p>
    </div>
  );

  return (
    <div className="w-full bg-[#0f1420] pt-32 pb-24 min-h-screen text-white selection:bg-[#4dabf7]/30 text-left">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex justify-end mb-10">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all shadow-sm"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium tracking-wide">Back to list</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 lg:gap-24 items-start">
          <div className="md:col-span-2 sticky top-40">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-b from-[#4dabf7]/20 to-transparent rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
              {/* 수정됨: aspect-[4/5]를 aspect-[2/3]으로 변경 */}
              <div className="relative aspect-[4/5] w-full bg-[#1a2133] rounded-[1.5rem] overflow-hidden border border-white/10 shadow-2xl">
                {imagePath ? (
                  <img
                    src={imagePath}
                    alt={person.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 italic">No Image</div>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-3 space-y-12 text-left">
            <div>
              <h1 className="text-5xl font-bold tracking-tight text-white mb-3 text-left">
                {person.name}
                {person.korean_name && <span className="ml-4 text-2xl font-light text-gray-400">{person.korean_name}</span>}
              </h1>
              <div className="inline-block px-3 py-1 rounded-md bg-[#4dabf7]/10 border border-[#4dabf7]/20">
                <p className="text-[#4dabf7] font-medium tracking-wide">{person.role}</p>
              </div>
            </div>

            <div className="space-y-8">
              {person.email && <InfoSection label="Email" content={person.email} icon={Mail} />}
              {person.research && <InfoSection label="Research" content={person.research} icon={FlaskConical} />}
              {person.interest && <InfoSection label="Interests" content={person.interest} icon={Target} />}
              {person.education && <InfoSection label="Education" content={person.education} icon={GraduationCap} />}
              {person.career && <InfoSection label="Career" content={person.career} icon={Briefcase} />}

              <div className="grid grid-cols-1 gap-6 pt-4 text-left">
                {person.projects && (
                  <div className="group flex flex-col gap-2 items-start">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-semibold pl-1 text-left">Main Project</p>
                    <button 
                      onClick={() => { setView('project'); setSelectedTitle(person.projects!); }}
                      className="w-full flex items-start text-left p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-[#4dabf7]/10 hover:border-[#4dabf7]/30 transition-all duration-300 group/btn"
                    >
                      <span className="flex-1 text-left text-lg text-gray-200 group-hover/btn:text-white leading-snug break-words">
                        {person.projects}
                      </span>
                      <ArrowUpRight size={20} className="shrink-0 text-gray-500 group-hover/btn:text-[#4dabf7] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all mt-1 ml-4" />
                    </button>
                  </div>
                )}

                {person.journal && (
                  <div className="group flex flex-col gap-2 items-start">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-semibold pl-1 text-left">Featured Journal</p>
                    <button 
                      onClick={() => { setView('research'); setSelectedTitle(person.journal!); }}
                      className="w-full flex items-start text-left p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-[#4dabf7]/10 hover:border-[#4dabf7]/30 transition-all duration-300 group/btn"
                    >
                      <span className="flex-1 text-left text-lg text-gray-200 group-hover/btn:text-white leading-snug break-words">
                        {person.journal}
                      </span>
                      <ArrowUpRight size={20} className="shrink-0 text-gray-500 group-hover/btn:text-[#4dabf7] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all mt-1 ml-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeopleDetail;