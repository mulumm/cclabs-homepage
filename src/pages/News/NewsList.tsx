import { useEffect, useMemo, useState } from 'react';
import type { NewsData } from '../../types';
import NewsDetail from './NewsDetail';

const NewsPage = () => {
  const [items, setItems] = useState<NewsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const modules = import.meta.glob<{ default: NewsData }>('../../assets/data/news/*.json', { eager: true });
        const loaded: NewsData[] = [];
        for (const [, m] of Object.entries(modules)) {
          const data = (m as { default: NewsData }).default;
          loaded.push(data);
        }
        // sort by date desc
        loaded.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setItems(loaded);
      } catch (error) {
        console.error('Failed to load news:', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const seminars = useMemo(() => items.filter((i) => (i.status || '').toLowerCase() === 'seminar'), [items]);
  const activities = useMemo(() => items.filter((i) => (i.status || '').toLowerCase() === 'activity'), [items]);

  const formatDate = (s: string) => {
    try {
      const d = new Date(s);
      return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\./g, '.').slice(0, -1);
    } catch {
      return s;
    }
  };

  // read hash to support navigation from main page (#news: or #news:detail:TITLE)
  useEffect(() => {
    const handleHash = () => {
      try {
        const h = window.location.hash || '';
        if (h.startsWith('#news:')) {
          const v = decodeURIComponent(h.slice('#news:'.length));
          if (v.startsWith('detail:')) {
            const title = v.slice('detail:'.length);
            setSelectedNews(title || null);
          } else {
            setSelectedNews(null);
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

  if (selectedNews) {
    return <NewsDetail newsTitle={selectedNews} onBack={() => setSelectedNews(null)} />;
  }

  return (
    <div className="w-full bg-[#0f1420] pt-32 pb-24 min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-[#4dabf7] font-semibold tracking-widest uppercase text-lg mb-3">Latest Updates</h2>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white">News & Updates</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">Check out the latest in the lab and its performance</p>
        </div>

        {/* Grid 레이아웃 수정: gap을 줄이고 내부 패딩으로 간격 조절 */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Seminars */}
          {/* 구분선 추가: PC에서는 오른쪽(border-r), 모바일에서는 아래쪽(border-b) */}
          <div className="flex flex-col items-center w-full border-b border-white/10 pb-8 md:pb-0 md:border-b-0 md:border-r md:pr-8">
            <h3 className="text-4xl text-gray-300 mb-6 font-semibold text-center">Seminar</h3>
            <div className="space-y-4 w-full">
              {loading ? (
                <div className="text-gray-400 text-center">로딩 중...</div>
              ) : seminars.length === 0 ? (
                <div className="text-gray-400 text-center">등록된 세미나가 없습니다.</div>
              ) : (
                seminars.map((it, idx) => (
                  <button
                    key={it.title + idx}
                    onClick={() => setSelectedNews(it.title)}
                    className="w-full bg-[#151b2b] rounded-2xl p-4 border border-white/5 hover:border-[#4dabf7]/20 transition-all duration-300 cursor-pointer hover:shadow-lg hover:bg-[#0f1420]/40 text-center"
                  >
                    <div className="w-full h-48 bg-gray-700 rounded-md overflow-hidden mb-3">
                      {it.image_name ? (
                        <img src={`/src/assets/uploads/news/${it.image_name}`} alt={it.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1">{it.title}</h4>
                    <p className="text-sm text-gray-400 font-mono">{formatDate(it.date)}</p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right: Activities */}
          {/* PC에서 왼쪽 패딩(pl-8)을 주어 구분선과 간격 확보 */}
          <div className="flex flex-col items-center w-full pt-8 md:pt-0 md:pl-8">
            <h3 className="text-4xl text-gray-300 mb-6 font-semibold text-center">Activity</h3>
            <div className="space-y-4 w-full">
              {loading ? (
                <div className="text-gray-400 text-center">로딩 중...</div>
              ) : activities.length === 0 ? (
                <div className="text-gray-400 text-center">등록된 활동이 없습니다.</div>
              ) : (
                activities.map((it, idx) => (
                  <button
                    key={it.title + idx}
                    onClick={() => setSelectedNews(it.title)}
                    className="w-full bg-[#151b2b] rounded-2xl p-4 border border-white/5 hover:border-[#4dabf7]/20 transition-all duration-300 cursor-pointer hover:shadow-lg hover:bg-[#0f1420]/40 text-center"
                  >
                    <div className="w-full h-48 bg-gray-700 rounded-md overflow-hidden mb-3">
                      {it.image_name ? (
                        <img src={`/src/assets/uploads/news/${it.image_name}`} alt={it.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1">{it.title}</h4>
                    <p className="text-sm text-gray-400 font-mono">{formatDate(it.date)}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;