import { MapPin, Mail, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#0b0f19] border-t border-white/5 pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-16">
          
          {/* 1. Brand & Description (4/12 columns) */}
          <div className="md:col-span-5 lg:col-span-5">
            <h3 className="text-xl font-bold text-white mb-6 tracking-wider flex items-center gap-2">
              <span className="w-2 h-8 bg-[#4dabf7] rounded-sm inline-block"></span>
              SANGMYUNG UNIV.
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6 font-light">
              Creative Content Labs<br />
              Department of Computer Science
            </p>
            <p className="text-sm text-gray-600 font-mono">
              Researching the future of AI <br/>and content generation.
            </p>
          </div>

          {/* 2. Address (3/12 columns) */}
          <div className="md:col-span-3 lg:col-span-3">
            <h4 className="text-[#4dabf7] font-bold mb-6 uppercase text-xs tracking-widest">Location</h4>
            <div className="flex items-start gap-3 group">
              <MapPin className="w-5 h-5 text-gray-500 group-hover:text-[#4dabf7] transition-colors mt-1 shrink-0" />
              <div className="space-y-1 text-sm text-gray-400 font-light leading-relaxed">
                <p>20, Hongjimun 2-gil</p>
                <p>Jongno-gu, Seoul</p>
                <p>Republic of Korea</p>
                <a 
                  href="https://maps.google.com/?q=Sangmyung+University" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-[#4dabf7] mt-2 transition-colors border-b border-transparent hover:border-[#4dabf7]"
                >
                  View on Map <ArrowUpRight size={12} />
                </a>
              </div>
            </div>
          </div>

          {/* 3. Contact (4/12 columns) */}
          <div className="md:col-span-4 lg:col-span-4">
            <h4 className="text-[#4dabf7] font-bold mb-6 uppercase text-xs tracking-widest">Contact Us</h4>
            <div className="space-y-4">
              <p 
                className="group flex items-center gap-3 p-3 rounded-lg bg-[#151b2b] border border-white/5 hover:border-[#4dabf7]/30 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-[#0f1420] flex items-center justify-center text-gray-500 group-hover:text-[#4dabf7] transition-colors">
                  <Mail size={14} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Professor</p>
                  <p className="text-sm text-gray-300 group-hover:text-white font-mono transition-colors">jwkim@smu.ac.kr</p>
                </div>
              </p>

              <p
                className="group flex items-center gap-3 p-3 rounded-lg bg-[#151b2b] border border-white/5 hover:border-[#4dabf7]/30 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-[#0f1420] flex items-center justify-center text-gray-500 group-hover:text-[#4dabf7] transition-colors">
                  <Mail size={14} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Professor</p>
                  <p className="text-sm text-gray-300 group-hover:text-white font-mono transition-colors">jungsoft97@smu.ac.kr</p>
                </div>
              </p>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">
            © 2024 Creative Content Labs. All rights reserved.
          </p>
          <div className="flex gap-6">
            {/* 필요한 경우 추가 링크 배치 */}
            <span className="text-xs text-gray-700 hover:text-gray-500 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-xs text-gray-700 hover:text-gray-500 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;