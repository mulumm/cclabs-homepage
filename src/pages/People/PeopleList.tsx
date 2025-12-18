import { useEffect, useMemo, useState } from 'react';
import { Mail, BookOpen, ArrowRight } from 'lucide-react';
import type { PersonData } from '../../types';
import PeopleDetail from './PeopleDetail';

// canonical categories
const CATEGORIES = ['Advisor', 'Alumni', "Master's Student", 'Undergraduate Student'] as const;
type Category = (typeof CATEGORIES)[number];
const categories: Category[] = [...CATEGORIES];

const PeoplePage = () => {
  const [people, setPeople] = useState<PersonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categories[0]);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  useEffect(() => {
    type PeopleJson = {
      title?: string;
      content?: string;
      createdAt?: string;
      name: string;
      korean_name?: string;
      role: string;
      email?: string;
      research?: string;
      interest?: string;
      education?: string;
      career?: string;
      people_image?: string;
    };

    const load = async () => {
      try {
        const modules = import.meta.glob<{ default: PeopleJson }>('../../assets/data/people/*.json', { eager: true });
        const loaded: PersonData[] = [];
        for (const [, m] of Object.entries(modules)) {
          const data = (m as { default: PeopleJson }).default;
          const roleRaw = (data.role || '').toString().trim();

          const normalizeString = (s: string) =>
            s.replace(/[‘’‚‛]/g, "'").replace(/\s+/g, ' ').trim();

          const roleNorm = normalizeString(roleRaw);

          const mapToCanonical = (r: string): Category | null => {
            const lowered = r.toLowerCase();
            if (lowered === 'advisor') return 'Advisor';
            if (lowered === 'alumni') return 'Alumni';
            if (lowered === "master's student" || lowered === 'masters student' || lowered === 'master student' || lowered === 'm.s.' || lowered === 'ms') return "Master's Student";
            if (lowered === 'undergraduate student' || lowered === 'undergrad' || lowered === 'undergraduate' || lowered === 'ug') return 'Undergraduate Student';
            for (const c of categories) {
              if (c.toLowerCase() === lowered) return c;
            }
            return null;
          };

          const canonical = roleNorm ? mapToCanonical(roleNorm) : null;

          const person: PersonData = {
            id: data.title || data.name,
            name: data.name,
            role: canonical ?? undefined,
            email: data.email,
            people_image: data.people_image,
            research: data.research,
            affiliation: undefined,
            extra: data as unknown as Record<string, unknown>
          };
          loaded.push(person);
        }
        setPeople(loaded);
      } catch (err) {
        console.error('Failed to load people:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    const parseHash = () => {
      try {
        const h = window.location.hash || '';
        if (h.startsWith('#people:')) {
          setSelectedPerson(null);
          
          const val = decodeURIComponent(h.split(':')[1] || '');
          if (!val) {
            setSelectedCategory(categories[0]);
            return;
          }
          const found = categories.find((c) => c.toLowerCase() === val.toLowerCase());
          if (found) {
            setSelectedCategory(found);
          }
        }
      } catch {
        // ignore
      }
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  const filtered = useMemo(() => {
    if (!selectedCategory) return people;
    return people.filter((p) => p.role === selectedCategory);
  }, [people, selectedCategory]);

  const imgSrc = (p: PersonData) => {
    const name = p.people_image || p.image_name;
    return name ? `/uploads/people/${name}` : null;
  };

  // 인원 수에 따른 그리드 클래스 생성 함수
  const getGridClass = (count: number) => {
    if (count === 1) {
      // 1명일 때: 중앙 정렬, 최대 너비 제한 (너무 넓어지지 않게)
      return 'grid-cols-1 max-w-md';
    }
    if (count === 2) {
      // 2명일 때: 2열 그리드, 최대 너비 적당히 제한
      return 'grid-cols-1 md:grid-cols-2 max-w-4xl';
    }
    // 3명 이상일 때: 기본 3열 그리드, 전체 너비 사용
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl';
  };

  if (selectedPerson) {
    return <PeopleDetail personId={selectedPerson} onBack={() => setSelectedPerson(null)} />;
  }

  return (
    <div className="w-full bg-[#0f1420] pt-32 pb-24 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-[#4dabf7] font-semibold tracking-widest uppercase text-lg mb-3">Our Team</h2>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white">People</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">Meet our outstanding research team members</p>
        </div>

        {/* 카테고리 탭 */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-base md:text-lg font-medium transition-all duration-300 ${
                selectedCategory === cat 
                  ? 'bg-[#4dabf7] text-black shadow-[0_0_20px_rgba(77,171,247,0.4)]' 
                  : 'bg-[#151b2b] text-gray-400 hover:bg-[#1c2536] hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 사람 목록 그리드 */}
        <div className="w-full">
          {loading ? (
            <div className="text-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4dabf7] mx-auto mb-4"></div>
              <p className="text-gray-400">Loading team members...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 bg-[#151b2b] rounded-3xl border border-white/5 max-w-4xl mx-auto">
              <p className="text-gray-400 text-lg">해당 카테고리에 등록된 멤버가 없습니다.</p>
            </div>
          ) : (
            /* 동적 그리드 클래스 적용: mx-auto로 컨테이너 자체를 중앙 정렬 */
            <div className={`grid gap-6 lg:gap-8 mx-auto transition-all duration-500 ${getGridClass(filtered.length)}`}>
              {filtered.map((p, idx) => {
                const researchAreas = Array.isArray(p.research) 
                  ? p.research 
                  : (p.research ? p.research.split(',').map(s => s.trim()) : []);

                return (
                  <button
                    key={p.id || idx}
                    onClick={() => setSelectedPerson(p.id || p.name)}
                    className="group flex flex-col bg-[#151b2b] rounded-3xl border border-white/5 hover:border-[#4dabf7]/30 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-[#263A77]/10 text-left relative h-full"
                  >
                    {/* 상단 장식용 그라데이션 라인 */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#4dabf7]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="p-8 flex flex-col h-full">
                      {/* 1. Header: Image & Name */}
                      <div className="flex items-center gap-6 mb-8">
                        <div className="relative shrink-0">
                          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-800 ring-2 ring-white/10 group-hover:ring-[#4dabf7] transition-all">
                            {imgSrc(p) ? (
                              <img
                                src={imgSrc(p)!}
                                alt={p.name}
                                className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                  const t = e.target as HTMLImageElement;
                                  t.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500 bg-[#0f1420]">
                                <span className="text-xs">No Img</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white group-hover:text-[#4dabf7] transition-colors mb-1">
                            {p.name}
                          </h3>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                             {p.role || 'Researcher'}
                          </p>
                        </div>
                      </div>

                      {/* 구분선 */}
                      <div className="w-full h-px bg-gradient-to-r from-white/5 via-white/10 to-white/5 mb-6"></div>

                      {/* 2. Body: Info Sections */}
                      <div className="space-y-6 flex-grow">
                        {/* Research Interest Section */}
                        <div>
                          <div className="flex items-center gap-2 text-[#4dabf7] mb-3">
                            <BookOpen size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">Research Interests</span>
                          </div>
                          
                          {researchAreas.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {researchAreas.map((area, i) => (
                                <span 
                                  key={i} 
                                  className="inline-block px-2.5 py-1 rounded-md bg-[#1c2536] text-gray-300 text-sm border border-white/5 group-hover:border-[#4dabf7]/20 transition-colors"
                                >
                                  {area}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-600 text-sm italic">No specific research areas listed.</p>
                          )}
                        </div>

                        {/* Email Section */}
                        <div>
                           <div className="flex items-center gap-2 text-[#4dabf7] mb-2">
                            <Mail size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">Contact</span>
                          </div>
                          <p className="text-gray-400 font-mono text-sm pl-6 break-all">
                            {p.email || 'No email provided'}
                          </p>
                        </div>
                      </div>

                      {/* 3. Footer: View Profile Text */}
                      <div className="mt-8 flex justify-end items-center gap-2 text-sm text-gray-500 group-hover:text-[#4dabf7] transition-colors">
                        <span className="font-medium">View Profile</span>
                        <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeoplePage;