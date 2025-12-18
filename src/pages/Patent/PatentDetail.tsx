import { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import type { PatentDetailData, PatentDetailProps } from '../../types';

const PatentDetail = ({ patentTitle, onBack }: PatentDetailProps) => {
  const [patent, setPatent] = useState<PatentDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPatentDetail = async () => {
      try {
        const patentModules = import.meta.glob<{ default: PatentDetailData }>(
          '../../assets/data/patent/*.json',
          { eager: true }
        );

        for (const [, module] of Object.entries(patentModules)) {
          const data = module.default;
          if (data.title === patentTitle) {
            setPatent(data);
            break;
          }
        }
      } catch (error) {
        console.error('Failed to load patent detail:', error);
      } finally {
        setLoading(false);
        // 페이지 상단으로 스크롤
        window.scrollTo(0, 0);
      }
    };

    loadPatentDetail();
  }, [patentTitle]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\./g, '.').slice(0, -1);
  };

  const extractAbstractText = (): string => {
    if (!patent?.abstract?.content) return '';
    
    const texts: string[] = [];
    patent.abstract.content.forEach((paragraph) => {
      if (paragraph.content) {
        paragraph.content.forEach((item) => {
          if (item.text) {
            texts.push(item.text);
          }
        });
      }
    });
    return texts.join(' ');
  };

  if (loading) {
    return (
      <div className="w-full bg-[#0f1420] pt-32 pb-24 min-h-screen text-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center py-20">
            <p className="text-gray-400">특허 정보를 로드 중입니다...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!patent) {
    return (
      <div className="w-full bg-[#0f1420] pt-32 pb-24 min-h-screen text-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center py-20">
            <p className="text-gray-400">특허 정보를 찾을 수 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  const abstractText = extractAbstractText();
  
  // 이미지 경로 생성 - 실제 파일 시스템 경로 사용
  const imagePath = patent.image_name
    ? `/uploads/patents/${patent.image_name}`
    : null;

  // 디버깅용 로그
  if (imagePath) {
    console.log('Patent Detail:', {
      title: patent.title,
      image_name: patent.image_name,
      uploadsPath: patent.uploadsPath,
      imagePath: imagePath
    });
  }

  return (
    <div className="w-full bg-[#0f1420] pt-32 pb-24 min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* 뒤로가기 버튼 */}
        <div className="flex justify-end mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-lg bg-[#151b2b] px-4 py-2 text-gray-300 transition-colors group hover:bg-[#1f273b] hover:text-white"
          >
            <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
            <span>Back</span>
          </button>
        </div>

        {/* 특허 상세 정보 카드 */}
        <div className="group relative bg-[#151b2b] rounded-3xl p-8 md:p-12 border border-white/5">
          {/* 제목 */}
          <h1 className="text-4xl md:text-4xl font-bold text-white mb-8 text-justify leading-tight">
            {patent.title}
          </h1>

          {/* 출원/등록기관 */}
          <p className="text-center text-gray-300 text-lg mb-8 font-semibold">
            {patent.associate}
          </p>

          {/* 특허번호와 등록일 - 나란하게 */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 mb-12 border-y border-white/10 py-8">
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-2">특허번호</p>
              <p className="text-white text-lg font-mono font-bold">{patent.patent_num}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-2">등록일</p>
              <p className="text-white text-lg font-mono font-bold">{formatDate(patent.date)}</p>
            </div>
          </div>

          {/* 초록 (Abstract) */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Abstract</h2>
            <p className="text-gray-300 leading-relaxed text-justify whitespace-pre-wrap">
              {abstractText}
            </p>
          </div>

          {/* 이미지 */}
          {imagePath && (
            <div className="mt-12">
              <div className="bg-[#0f1420] rounded-2xl p-6 border border-white/5 flex items-center justify-center min-h-[400px]">
                <img
                  src={imagePath}
                  alt={patent.title}
                  className="max-w-full max-h-[500px] object-contain rounded-lg"
                  onLoad={() => {
                    console.log('Image loaded successfully:', imagePath);
                  }}
                  onError={(e) => {
                    console.error('Image failed to load:', {
                      src: imagePath,
                      error: e
                    });
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'text-gray-500 text-center w-full';
                    errorDiv.innerHTML = `<p>이미지를 불러올 수 없습니다.</p><p style="font-size: 12px; margin-top: 8px; color: #888;">경로: ${imagePath}</p>`;
                    target.parentElement?.appendChild(errorDiv);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatentDetail;
