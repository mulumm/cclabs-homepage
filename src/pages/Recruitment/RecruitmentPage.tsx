import { Mail } from 'lucide-react'; // 아이콘 사용을 위해 import 필요

const RecruitmentPage = () => {
  // 연락처 정보 데이터화
  const contacts = [
    { name: "Prof. Jongwon Kim", email: "jwkim@smu.ac.kr", role: "Professor" },
    { name: "Prof. Daesik Jung", email: "jungsoft97@smu.ac.kr", role: "Professor" },
    { name: "Kyeongmin Jeon", email: "wjsrudals69@naver.com", role: "Lab Leader" },
    { name: "Sunghan Kim", email: "lucidus814@gmail.com", role: "Vice Lab Leader" },
  ];

  return (
    <div className="w-full bg-[#0f1420] pt-32 pb-24 min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        
        {/* 1. Header Section */}
        <div className="text-center mb-20">
          <h2 className="text-[#4dabf7] font-semibold tracking-widest uppercase text-lg mb-3">Join Our Team</h2>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white">
            Recruitment
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            With CCLabs, the future of artificial intelligence<br className="hidden md:block"/>
            We are recruiting passionate researchers to make.
          </p>
        </div>
        
        {/* 2. Open Positions Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {/* Undergraduate Card */}
          <div className="group relative bg-[#151b2b] rounded-3xl p-8 md:p-10 border border-white/5 hover:border-[#4dabf7]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#263A77]/10">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-6xl font-bold text-white">00</span>
            </div>
            <div className="relative z-10">
              <div className="inline-block px-3 py-1 rounded-full bg-[#263A77]/30 text-[#4dabf7] text-xs font-bold tracking-wider mb-6 border border-[#263A77]/50">
                Undergraduate
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">학부 과정</h3>
              <p className="text-gray-500 mb-8 text-sm">Undergraduate Student</p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">Qualification</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start text-gray-400 text-sm">
                      <span className="mr-3 text-[#4dabf7]">―</span> 프로그래밍 기초 지식
                    </li>
                    <li className="flex items-start text-gray-400 text-sm">
                      <span className="mr-3 text-[#4dabf7]">―</span> 인공지능 기초 지식
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* M.S. Student Card */}
          <div className="group relative bg-[#151b2b] rounded-3xl p-8 md:p-10 border border-white/5 hover:border-[#4dabf7]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#263A77]/10">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-6xl font-bold text-white">01</span>
            </div>
            
            <div className="relative z-10">
              <div className="inline-block px-3 py-1 rounded-full bg-[#263A77]/30 text-[#4dabf7] text-xs font-bold tracking-wider mb-6 border border-[#263A77]/50">
                MASTER'S
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">석사 과정</h3>
              <p className="text-gray-500 mb-8 text-sm">M.S. Student</p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">Qualification</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start text-gray-400 text-sm">
                      <span className="mr-3 text-[#4dabf7]">―</span> Python, C 프로그래밍 구현 능력
                    </li>
                    <li className="flex items-start text-gray-400 text-sm">
                      <span className="mr-3 text-[#4dabf7]">―</span> Deep Learning / Machine Learning 기초 지식
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Ph.D. Student Card */}
          <div className="group relative bg-[#151b2b] rounded-3xl p-8 md:p-10 border border-white/5 hover:border-[#4dabf7]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#263A77]/10">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
               <span className="text-6xl font-bold text-white">02</span>
            </div>

            <div className="relative z-10">
              <div className="inline-block px-3 py-1 rounded-full bg-[#263A77]/30 text-[#4dabf7] text-xs font-bold tracking-wider mb-6 border border-[#263A77]/50">
                PH.D.
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">박사 과정</h3>
              <p className="text-gray-500 mb-8 text-sm">Ph.D. Student</p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">Qualification</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start text-gray-400 text-sm">
                      <span className="mr-3 text-[#4dabf7]">―</span> 관련 분야 석사 학위 소지자
                    </li>
                    <li className="flex items-start text-gray-400 text-sm">
                      <span className="mr-3 text-[#4dabf7]">―</span> 국제 학회/저널 논문 게재 경험
                    </li>
                    <li className="flex items-start text-gray-400 text-sm">
                      <span className="mr-3 text-[#4dabf7]">―</span> 독립적인 연구 프로젝트 수행 가능자
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 3. Apply Section (수정된 부분) */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#1a2333] to-[#151b2b] rounded-3xl border border-white/5 p-8 md:p-12">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
             
             {/* Left Column: Description & Contacts */}
             <div>
               <h2 className="text-3xl font-bold mb-4 text-white">How to Apply</h2>
               <p className="text-gray-400 leading-relaxed mb-8">
                 관심 있는 학생은 아래 이메일로 서류를 제출해주세요.<br/>
                 검토 후 개별적으로 면담 일정을 안내해 드리겠습니다.
               </p>

               {/* New Contact List Design */}
               <div className="grid grid-cols-1 gap-3">
                 {contacts.map((contact, index) => (
                   <div 
                     key={index} 
                     className="group flex flex-col sm:flex-row sm:items-center justify-between bg-[#0f1420]/60 border border-white/10 rounded-xl p-4 hover:border-[#4dabf7]/50 transition-all duration-300 hover:bg-[#0f1420]"
                   >
                     <div className="flex items-center gap-4 mb-2 sm:mb-0">
                       <div className="w-10 h-10 rounded-lg bg-[#1c2536] flex items-center justify-center text-[#4dabf7] group-hover:scale-110 transition-transform">
                         <Mail size={20} />
                       </div>
                       <div>
                         <p className="text-white font-medium">{contact.name}</p>
                         <p className="text-xs text-gray-500 uppercase tracking-wider">{contact.role}</p>
                       </div>
                     </div>
                     <a 
                       href={`mailto:${contact.email}`} 
                       className="text-gray-400 text-sm font-mono hover:text-[#4dabf7] transition-colors pl-14 sm:pl-0"
                     >
                       {contact.email}
                     </a>
                   </div>
                 ))}
               </div>
             </div>

             {/* Right Column: Required Documents */}
             <div className="lg:border-l border-white/5 lg:pl-12 flex flex-col justify-center">
                <h4 className="text-sm font-semibold text-[#4dabf7] uppercase tracking-wide mb-6">Required Documents</h4>
                <ul className="space-y-4">
                  {[
                    "Resume (이력서)",
                    "Academic Transcript (성적증명서)",
                    "Research Statement (자기소개 및 연구계획)"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center p-4 rounded-xl bg-[#151b2b]/50 border border-white/5 text-gray-300">
                      <div className="w-2 h-2 rounded-full bg-[#4dabf7] mr-4 shadow-[0_0_10px_#4dabf7]"></div>
                      {item}
                    </li>
                  ))}
                </ul>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default RecruitmentPage;