// 네비게이션 메뉴 타입
export type MenuType = 'Main' | 'People' | 'Research' | 'Project' | 'Playground' | 'News' | 'Patent' | 'Recruitment';

// 페이지 props 타입
export interface PageProps {
  currentPage: MenuType;
}

// 헤더 props 타입
export interface HeaderProps {
  currentPage: MenuType;
  onPageChange: (page: MenuType) => void;
}
export interface ProseMirrorData {
  type: string;
  content: {
    type: string;
    attrs?: {
      [key: string]: any;
    };
    content?: {
      type: string;
      text?: string;
      [key: string]: any;
    }[];
  }[];
}
// Patent 관련 타입
export interface AbstractContent {
  type: string;
  text?: string;
  marks?: Array<{ type: string }>;
}

export interface AbstractParagraph {
  type: string;
  attrs: {
    textAlign: string | null;
  };
  content: AbstractContent[];
}

export interface PatentData {
  title: string;
  patent_num: string;
  date: string;
  associate: string;
  abstract: ProseMirrorData;
}

export interface PatentDetailData extends PatentData {
  abstract: {
    type: string;
    content: AbstractParagraph[];
  };
  image_name: string;
  uploadsPath: string;
}

export interface PatentDetailProps {
  patentTitle: string;
  onBack: () => void;
}

// People 관련 타입
export interface PeopleEducation {
  degree?: string;
  field?: string;
  institution?: string;
  start?: string;
  end?: string | null;
  note?: string;
}

export interface PeoplePosition {
  title?: string;
  organization?: string;
  start?: string;
  end?: string | null;
  description?: string;
}

export interface PeopleSocial {
  homepage?: string;
  google_scholar?: string;
  orcid?: string;
  linkedin?: string;
  researchgate?: string;
  github?: string;
}

export interface PersonData {
  id?: string;
  name: string;
  name_en?: string;
  // role must be one of the four canonical values used in JSON files
  role?: 'Alumni' | 'Advisor' | "Master's Student" | 'Undergraduate Student';
  affiliation?: string;
  email?: string;
  phone?: string;
  research?: string | string[];
  research_interests?: string[];
  education?: PeopleEducation[];
  positions?: PeoplePosition[];
  social?: PeopleSocial;
  tags?: string[];
  people_image?: string; // 파일명
  image_name?: string; // alternate
  uploadsPath?: string;
  created_at?: string;
  updated_at?: string;
  locale?: string;
  extra?: Record<string, unknown>;
}

// Detailed data shape matching JSON files in assets/data/people
export interface PeopleDetailData {
  title?: string;
  content?: string;
  createdAt?: string;
  name: string;
  korean_name?: string;
  role: 'Alumni' | 'Advisor' | "Master's Student" | 'Undergraduate Student';
  email?: string;
  research?: string;
  interest?: string;
  education?: string;
  career?: string;
  projects?: string;
  journal?: string;
  people_image?: string;
}

export interface PeopleDetailProps {
  personId: string;
  onBack: () => void;
}

// News 관련 타입
export interface NewsData {
  title: string;
  status: 'seminar' | 'activity' | string;
  date: string;
  introduce?: string;
  image_name?: string;
  createdAt?: string;
}

export interface NewsDetailProps {
  newsTitle: string;
  onBack: () => void;
}

// Project 관련 타입
export interface ProjectData {
  title: string;
  status: 'Industry Collaboration' | 'Government projects' | string;
  progress_status: 'progress' | 'completed' | string;
  start_date?: string;
  end_date?: string;
  PI?: string;
  participant?: string;
  project_method?: string;
  project_target?: string;
  abstract?: string;
  imageName?: string;
  createdAt?: string;
}

export interface ProjectDetailProps {
  projectTitle: string;
  onBack: () => void;
}

// Research 관련 타입
export interface ResearchDate {
  prepare?: string;
  submit?: string;
  accept?: string;
  publish?: string;
}

export interface ResearchData {
  title: string;
  status: 'Korean academic conference' | 'Korean journal' | 'International conference' | 'International journal' | string;
  progress_status: 'progress' | 'completed' | string;
  scholarly_society?: string;
  date?: ResearchDate;
  link?: string;
  authors?: string;
  abstract?: string;
  result_image_name?: string;
  createdAt?: string;
}

export interface ResearchDetailProps {
  researchTitle: string;
  onBack: () => void;
}