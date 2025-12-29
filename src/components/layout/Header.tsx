import { useState } from 'react';
import { Menu, X } from 'lucide-react';

// 타입 정의
export type MenuType = 'Main' | 'People' | 'Research' | 'Project' | 'Playground' |'News' | 'Patent' | 'Recruitment';
export interface HeaderProps {
  currentPage: string;
  onPageChange: (page: MenuType) => void;
}

const Header = ({ currentPage, onPageChange }: HeaderProps) => {
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems: MenuType[] = ['Main', 'People', 'Research', 'Project', 'Playground','News', 'Patent', 'Recruitment'];

  const subMenus: { [key: string]: string[] } = {
    People: ['ADVISOR', 'ALUMNI', "MASTER'S STUDENTS", 'UNDERGRADUATE STUDENTS'],
    Research: ['International Conference', 'International Journal', 'Korean Conference', 'Korean Journal'],
    Project: ['GOVERNMENT PROJECT', 'INDUSTRY COLLABORATION'],
  };

  // [핵심] 텍스트 매핑 로직을 함수로 분리 (유지보수 용이성)
  const mapToCanonical = (menu: string, subItem: string) => {
    const lowered = subItem.toLowerCase();
    if (menu === 'People') {
      if (lowered.includes('alumni')) return 'Alumni';
      if (lowered.includes('advisor')) return 'Advisor';
      if (lowered.includes('master')) return "master's student";
      if (lowered.includes('undergrad')) return 'undergraduate student';
      return subItem;
    }
    if (menu === 'Research') {
      if (lowered.includes('international') && lowered.includes('conference')) return 'International conference';
      if (lowered.includes('international') && lowered.includes('journal')) return 'International journal';
      if (lowered.includes('korean') && lowered.includes('conference')) return 'Korean academic conference';
      if (lowered.includes('korean') && lowered.includes('journal')) return 'Korean journal';
      return subItem;
    }
    if (menu === 'Project') {
      if (lowered.includes('government')) return 'Government projects';
      if (lowered.includes('industry')) return 'Industry Collaboration';
      return subItem;
    }
    return subItem;
  };

  // [핵심] 네비게이션 통합 핸들러
  const handleNavigation = (menu: MenuType, subItem?: string) => {
    if (menu === 'Playground') {
      alert('업데이트 예정입니다.');
      return;
    }
    
    // [WORKAROUND] If clicking 'Research' while already on a research sub-page (like Detail),
    // force a browser navigation to reset the component state, since the state owner component
    // cannot be modified per user constraints.
    if (menu === 'Research' && !subItem && currentPage === 'Research') {
      window.location.assign('/#research:');
      return;
    }

    // 1. 페이지 변경 요청 (React State 업데이트)
    onPageChange(menu);

    // 2. URL Hash 설정 (페이지 내부 필터링용)
    // subItem이 있으면 해당 필터로, 없으면(메인메뉴 클릭 시) 초기화
    if (subItem) {
      const canonical = mapToCanonical(menu, subItem);
      window.location.hash = `#${menu.toLowerCase()}:${encodeURIComponent(canonical)}`;
    } else {
      // 서브메뉴 없이 메인 메뉴 클릭 시 해시를 초기화하거나 기본값으로 설정
      // 예: #project: 로 설정하여 전체 목록을 보여주도록 유도
      if (['People', 'Research', 'Project'].includes(menu)) {
        window.location.hash = `#${menu.toLowerCase()}:`;
      } else {
        // News, Patent 등 필터가 없는 페이지는 해시 제거
        window.history.pushState("", document.title, window.location.pathname + window.location.search);
      }
    }

    // 3. UI 상태 정리
    setHoveredMenu(null);
    setIsMobileOpen(false);
    
    // 4. 강제 스크롤 상단 이동 (페이지 전환 시 스크롤이 아래에 남아있는 경우 방지)
    window.scrollTo(0, 0);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#0f1420]/90 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* 로고 영역 */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => handleNavigation('Main')}>
            <img
              src="/cclab_icon.svg"
              alt="CCLAB"
              className="h-10 w-auto object-contain hover:opacity-90 transition-opacity"
            />
          </div>

          {/* 네비게이션 메뉴 (데스크탑) */}
          <nav className="hidden lg:block">
            <div className="flex items-center space-x-12">
              {menuItems.map((item) => (
                <div
                  key={item}
                  className="relative h-20 flex items-center"
                  onMouseEnter={() => setHoveredMenu(item)}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`
                      relative bg-transparent border-none p-0 cursor-pointer outline-none focus:outline-none focus:ring-0
                      text-sm font-medium tracking-wide transition-colors duration-200 uppercase
                      ${currentPage.toLowerCase() === item.toLowerCase() ? 'text-[#4dabf7]' : 'text-gray-300 hover:text-white'}
                    `}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <span className="font-sans text-base">{item === 'Research' ? 'PAPER & RESEARCH' : item}</span>
                    <span
                      className={`absolute -bottom-2 left-0 w-full h-0.5 bg-[#4dabf7] transition-opacity duration-200 
                        ${currentPage.toLowerCase() === item.toLowerCase() ? 'opacity-100' : 'opacity-0'}
                      `}
                    />
                  </button>

                  {/* 드롭다운 메뉴 */}
                  {subMenus[item as keyof typeof subMenus] && hoveredMenu === item && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-[#1a202c] border border-white/10 shadow-2xl min-w-[200px] py-2 rounded-b-lg">
                      {subMenus[item as keyof typeof subMenus].map((subItem, index) => (
                        <div
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation(); // 부모 클릭 방지
                            handleNavigation(item, subItem);
                          }}
                          className="px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer uppercase tracking-wider text-center transition-colors"
                        >
                          {subItem}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="text-white bg-transparent border-none focus:outline-none">
              {isMobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 드롭다운 */}
      {isMobileOpen && (
        <div className="lg:hidden bg-[#0f1420] border-t border-white/10 max-h-[80vh] overflow-y-auto">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <div key={item}>
                <button
                  onClick={() => handleNavigation(item)}
                  className="block w-full text-left px-3 py-4 text-base font-bold text-white bg-transparent border-none hover:bg-white/5 border-b border-white/5 uppercase focus:outline-none"
                >
                  {item === 'Research' ? 'PAPER & RESEARCH' : item}
                </button>
                {/* 모바일에서도 서브메뉴를 보여주고 싶다면 아래 주석 해제 */}
                {/* {subMenus[item] && (
                  <div className="pl-6 bg-[#0a0d14]">
                    {subMenus[item].map((sub, idx) => (
                      <div 
                        key={idx} 
                        className="py-3 text-sm text-gray-400 border-b border-white/5"
                        onClick={() => handleNavigation(item, sub)}
                      >
                        {sub}
                      </div>
                    ))}
                  </div>
                )} 
                */}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;