import { useState } from 'react';
import { Menu, X } from 'lucide-react';

// 타입 정의
export type MenuType = 'Main' | 'People' | 'Research' | 'Project' | 'News' | 'Patent' | 'Recruitment';
export interface HeaderProps {
  currentPage: string;
  onPageChange: (page: MenuType) => void;
}

const Header = ({ currentPage, onPageChange }: HeaderProps) => {
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems: MenuType[] = ['Main', 'People', 'Research', 'Project', 'News', 'Patent', 'Recruitment'];

  const subMenus: { [key: string]: string[] } = {
    People: ['ADVISOR', 'ALUMNI', "MASTER'S STUDENTS", 'UNDERGRADUATE STUDENTS'],
    Research: ['International Conference', 'International Journal','Korean Conference', 'Korean Journal'],
    Project: ['GOVERNMENT PROJECT', 'INDUSTRY COLLABORATION'],
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#0f1420]/90 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* 로고 영역 */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => onPageChange('Main')}>
            <img
              src="/src/assets/cclab_icon.svg"
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
                    onClick={() => {
                      try {
                        // clear page-specific hash so main view opens (avoid lingering sub-selection)
                        if (item === 'Project') {
                          window.location.hash = '#project:';
                        } else if (item === 'Research') {
                          window.location.hash = '#research:';
                        } else if (item === 'People') {
                          window.location.hash = '#people:';
                        }
                      } catch {
                        // ignore
                      }
                      onPageChange(item);
                    }}
                    className={`
                      relative bg-transparent border-none p-0 cursor-pointer outline-none focus:outline-none focus:ring-0
                      text-sm font-medium tracking-wide transition-colors duration-200 uppercase
                      ${currentPage.toLowerCase() === item.toLowerCase() ? 'text-[#4dabf7]' : 'text-gray-300 hover:text-white'}
                    `}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <span className="font-sans text-base">{item}</span>
                    <span
                      className={`absolute -bottom-2 left-0 w-full h-0.5 bg-[#4dabf7] transition-opacity duration-200 
                        ${currentPage.toLowerCase() === item.toLowerCase() ? 'opacity-100' : 'opacity-0'}
                      `}
                    />
                  </button>

                  {/* 드롭다운 메뉴 */}
                  {subMenus[item as keyof typeof subMenus] && hoveredMenu === item && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-[#1a202c] border border-white/10 shadow-2xl min-w-[200px] py-2 rounded-b-lg">
                      {subMenus[item as keyof typeof subMenus].map((subItem, index) => {
                        // Map subItem text to canonical category used by each page
                        const mapToCanonical = (menu: string, s: string) => {
                          const lowered = s.toLowerCase();
                          if (menu === 'People') {
                            if (lowered.includes('alumni')) return 'Alumni';
                            if (lowered.includes('advisor')) return 'Advisor';
                            if (lowered.includes('master')) return "master's student";
                            if (lowered.includes('undergrad')) return 'undergraduate student';
                            return s;
                          }
                          if (menu === 'Research') {
                            // normalize various labels to ResearchMain's categories
                            if (lowered.includes('international') && lowered.includes('conference')) return 'International conference';
                            if (lowered.includes('international') && lowered.includes('journal')) return 'International journal';
                            if (lowered.includes('korean') && lowered.includes('conference')) return 'Korean academic conference';
                            if (lowered.includes('korean') && lowered.includes('journal')) return 'Korean journal';
                            // fallback: title-case
                            return s;
                          }
                          if (menu === 'Project') {
                            if (lowered.includes('government')) return 'Government projects';
                            if (lowered.includes('industry')) return 'Industry Collaboration';
                            return s;
                          }
                          return s;
                        };

                        const canonical = mapToCanonical(item, subItem);

                        return (
                          <div
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              // navigate to parent page
                              onPageChange(item);
                              // write hash for page to pick up selection
                              try {
                                if (item === 'People') {
                                  window.location.hash = `#people:${encodeURIComponent(canonical)}`;
                                } else if (item === 'Research') {
                                  window.location.hash = `#research:${encodeURIComponent(canonical)}`;
                                } else if (item === 'Project') {
                                  window.location.hash = `#project:${encodeURIComponent(canonical)}`;
                                } else {
                                  // generic fallback
                                  window.location.hash = `#${item.toLowerCase()}:${encodeURIComponent(canonical)}`;
                                }
                              } catch {
                                // ignore
                              }
                              setHoveredMenu(null);
                            }}
                            className="px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer uppercase tracking-wider text-center transition-colors"
                          >
                            {subItem}
                          </div>
                        );
                      })}
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
                  onClick={() => { onPageChange(item); setIsMobileOpen(false); }}
                  className="block w-full text-left px-3 py-4 text-base font-bold text-white bg-transparent border-none hover:bg-white/5 border-b border-white/5 uppercase focus:outline-none"
                >
                  {item}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;