import { useEffect, useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MainPage from './pages/Main/MainPage';
import PeoplePage from './pages/People/PeopleList';
import ResearchPage from './pages/Research/ResearchMain';
import ProjectPage from './pages/Project/ProjectMain';
import NewsPage from './pages/News/NewsList';
import PatentPage from './pages/Patent/PatentList';
import RecruitmentPage from './pages/Recruitment/RecruitmentPage';
import type { MenuType } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<MenuType>('Main');

  // listen to hash changes so external code (main page, header) can navigate by setting window.location.hash
  useEffect(() => {
    const handleHash = () => {
      try {
        const h = window.location.hash || '';
        if (h.startsWith('#news:') || h.startsWith('#news')) {
          setCurrentPage('News');
          return;
        }
        if (h.startsWith('#project:') || h.startsWith('#project')) {
          setCurrentPage('Project');
          return;
        }
        if (h.startsWith('#research:') || h.startsWith('#research')) {
          setCurrentPage('Research');
          return;
        }
        if (h.startsWith('#people:') || h.startsWith('#people')) {
          setCurrentPage('People');
          return;
        }
      } catch {
        // ignore
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'Main':
        return <MainPage />;
      case 'People':
        return <PeoplePage />;
      case 'Research':
        return <ResearchPage />;
      case 'Project':
        return <ProjectPage />;
      case 'News':
        return <NewsPage />;
      case 'Patent':
        return <PatentPage />;
      case 'Recruitment':
        return <RecruitmentPage />;
      default:
        return <MainPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 w-screen overflow-x-hidden">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 w-screen pt-16">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;