import { useEffect, useState } from 'react';
import type { ProjectData, ProjectDetailProps } from '../../types';
import { ChevronLeft } from 'lucide-react';

const ProjectDetail = ({ projectTitle, onBack }: ProjectDetailProps) => {
  const [item, setItem] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const modules = import.meta.glob<{ default: ProjectData }>('../../assets/data/project/*.json', { eager: true });
        for (const [, m] of Object.entries(modules)) {
          const data = (m as { default: ProjectData }).default;
          if (data.title === projectTitle) {
            setItem(data);
            break;
          }
        }
      } catch (error) {
        console.error('Failed to load project detail:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [projectTitle]);

  if (loading) {
    return (
      <div 
        className="w-full !bg-[#0f1420] pt-32 pb-24 min-h-screen !text-white"
        style={{ colorScheme: 'dark' }}
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-8">로딩 중...</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div 
        className="w-full !bg-[#0f1420] pt-32 pb-24 min-h-screen !text-white"
        style={{ colorScheme: 'dark' }}
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center py-24">
            <p className="text-gray-400">해당 프로젝트를 찾을 수 없습니다.</p>
            <button 
              onClick={onBack} 
              className="mt-6 px-4 py-2 rounded-lg !bg-[#151b2b] hover:!bg-[#1a2130] border border-white/5 !text-gray-200 transition-all"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    // [설정 1] color-scheme: dark 및 배경색 고정
    <div 
      className="w-full !bg-[#0f1420] pt-32 pb-24 min-h-screen !text-white"
      style={{ colorScheme: 'dark' }}
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="flex justify-end mb-6">
          <button 
            onClick={onBack} 
            // [설정 2] Back 버튼 스타일 수정
            // 기존의 파란색 텍스트(text-[#4dabf7]) 대신, 
            // 화면과 어울리는 어두운 배경(!bg-[#151b2b])과 회색 텍스트(!text-gray-400)를 적용했습니다.
            className="flex items-center gap-2 px-4 py-2 rounded-lg !bg-[#151b2b] hover:!bg-[#1a2130] border border-white/5 !text-gray-400 hover:!text-white transition-all group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
        </div>

        <h1 className="text-4xl font-bold !text-white mb-3">{item.title}</h1>
        <p className="text- !text-gray-400 font-mono mb-6">{item.start_date} — {item.end_date || ''}</p>

        <div className="w-full h-[420px] !bg-[#151b2b] rounded-md overflow-hidden mb-6 border border-white/5">
          {item.imageName ? (
            <img src={`/uploads/project/${item.imageName}`} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
          )}
        </div>

        <div className="space-y-4 !text-gray-200">
          <div>
            <h3 className="font-semibold !text-white">Participants</h3>
            <p className="!text-gray-300">{item.participant}</p>
          </div>

          <div>
            <h3 className="font-semibold !text-white">Project Method</h3>
            <p className="!text-gray-300 whitespace-pre-wrap">{item.project_method}</p>
          </div>

          <div>
            <h3 className="font-semibold !text-white">Project Target</h3>
            <p className="!text-gray-300 whitespace-pre-wrap">{item.project_target}</p>
          </div>

          <div>
            <h3 className="font-semibold !text-white">Abstract</h3>
            <p className="!text-gray-300 whitespace-pre-wrap">{item.abstract}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;