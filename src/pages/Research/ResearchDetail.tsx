import React, { useEffect, useState } from 'react';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import type { ResearchData } from '../../types';

type Props = {
  researchTitle: string;
  onBack?: () => void;
};

const ResearchDetail: React.FC<Props> = ({ researchTitle, onBack }) => {
  const [item, setItem] = useState<ResearchData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const modules = import.meta.glob<{ default: ResearchData }>('../../assets/data/research/*.json', { eager: true });
        const loaded: ResearchData[] = Object.values(modules).map((m) => (m as { default: ResearchData }).default);
        const found = loaded.find((r) => r.title === researchTitle) || null;
        setItem(found);
      } catch (error) {
        console.error('Failed to load research detail:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [researchTitle]);

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
            <p className="text-gray-400">해당 연구 정보를 찾을 수 없습니다.</p>
            {onBack && (
              <button onClick={onBack} className="mt-6 px-4 py-2 bg-[#4dabf7] text-black rounded">Back</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const imgSrc = item.result_image_name ? `/src/assets/uploads/research/${item.result_image_name}` : null;

  return (
    <div className="w-full bg-[#0f1420] pt-32 pb-24 min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        {/* Back Button */}
        <div className="flex justify-end mb-6">
          {onBack && (
            <button onClick={onBack} className="flex items-center gap-2 text-[#4dabf7] hover:text-white transition-colors group">
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span>back</span>
            </button>
          )}
        </div>

        {/* Title & Meta Info */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{item.title}</h1>
        
        <div className="flex flex-wrap gap-4 text-sm font-mono text-gray-400 mb-8 pb-8 border-b border-white/10">
           <span className="px-3 py-1 rounded-full bg-[#151b2b] border border-white/10 text-[#4dabf7]">
             {item.status}
           </span>
           <span className="px-3 py-1 rounded-full bg-[#151b2b] border border-white/10 text-green-400">
             {item.progress_status}
           </span>
        </div>

        {/* Main Image */}
        {imgSrc && (
          <div className="w-full mb-10">
            <img 
              src={imgSrc} 
              alt={item.title} 
              className="w-full h-auto rounded-xl shadow-2xl border border-white/5" 
            />
          </div>
        )}

        {/* Content Sections */}
        <div className="space-y-8 text-gray-200">
          
          {/* Authors */}
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Authors</h3>
            <p className="text-gray-300 leading-relaxed">{item.authors || 'N/A'}</p>
          </div>

          {/* Scholarly Society */}
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Scholarly Society</h3>
            <p className="text-gray-300 leading-relaxed">{item.scholarly_society || 'N/A'}</p>
          </div>

          {/* Dates */}
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Dates</h3>
            <ul className="text-gray-300 leading-relaxed">
              {item.date?.publish && <li><strong>Published:</strong> {item.date.publish}</li>}
              {item.date?.accept && <li><strong>Accepted:</strong> {item.date.accept}</li>}
              {item.date?.submit && <li><strong>Submitted:</strong> {item.date.submit}</li>}
              {item.date?.prepare && <li><strong>Prepared:</strong> {item.date.prepare}</li>}
            </ul>
          </div>

          {/* Abstract */}
          {item.abstract && (
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Abstract</h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">{item.abstract}</p>
            </div>
          )}

          {/* External Link */}
          {item.link && (
            <div className="pt-4">
              <a 
                href={item.link} 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#151b2b] border border-white/10 text-[#4dabf7] hover:bg-[#4dabf7] hover:text-black transition-all duration-300 font-medium"
              >
                <span>View Original Paper</span>
                <ExternalLink size={18} />
              </a>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ResearchDetail;