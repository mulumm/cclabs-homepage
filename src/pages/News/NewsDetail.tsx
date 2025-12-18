import { useEffect, useState } from 'react';
import type { NewsData, NewsDetailProps } from '../../types';
import { ChevronLeft } from 'lucide-react';

const NewsDetail = ({ newsTitle, onBack }: NewsDetailProps) => {
  const [item, setItem] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const modules = import.meta.glob<{ default: NewsData }>('../../assets/data/news/*.json', { eager: true });
        for (const [, m] of Object.entries(modules)) {
          const data = (m as { default: NewsData }).default;
          if (data.title === newsTitle) {
            setItem(data);
            break;
          }
        }
      } catch (error) {
        console.error('Failed to load news detail:', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [newsTitle]);

  if (loading) {
    return (
      <div className="w-full bg-[#0f1420] pt-32 pb-24 min-h-screen text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">로딩 중...</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="w-full bg-[#0f1420] pt-32 pb-24 min-h-screen text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center py-24">
            <p className="text-gray-400">해당 뉴스 항목을 찾을 수 없습니다.</p>
            <button onClick={onBack} className="mt-6 px-4 py-2 bg-[#4dabf7] text-black rounded">Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0f1420] pt-32 pb-24 min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* 수정됨: Flexbox를 사용하여 버튼을 오른쪽(justify-end)으로 배치 */}
        <div className="flex justify-end mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group px-4 py-2 rounded-full bg-gray-500/10 hover:bg-gray-500/20"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
        </div>

        <h1 className="text-4xl font-bold text-white mb-3">{item.title}</h1>
        <p className="text-sm text-gray-400 font-mono mb-6">{item.date}</p>

        <div className="w-full h-[420px] bg-gray-800 rounded-md overflow-hidden mb-6">
          {item.image_name ? (
            <img src={`/uploads/news/${item.image_name}`} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
          )}
        </div>

        {/* 수정됨: text-base 추가하여 폰트 크기 조정 */}
        <div className="prose prose-invert max-w-none text-gray-200 whitespace-pre-wrap text-lg">
          {item.introduce}
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;