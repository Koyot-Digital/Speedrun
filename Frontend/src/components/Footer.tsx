import { Github } from 'lucide-react';

type FooterProps = {
  isDarkMode: boolean;
};

export function Footer({ isDarkMode }: FooterProps) {
  return (
    <footer className={`mt-12 pt-8 pb-6 border-t ${isDarkMode ? 'border-[#4A4458]' : 'border-gray-200'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className={`text-xs sm:text-sm ${isDarkMode ? 'text-[#938F99]' : 'text-gray-600'} text-center sm:text-left`}>
            <p>
              Licensed under{' '}
              <a
                href="https://creativecommons.org/licenses/by-sa/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className={isDarkMode ? 'text-[#D0BCFF] hover:text-[#E8DEF8]' : 'text-purple-600 hover:text-purple-700'}
              >
                CC-BY-SA 4.0
              </a>
            </p>
          </div>
          
          <a
            href="https://github.com/koyot-digital/speedrun"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm ${
              isDarkMode 
                ? 'bg-[#2B2930] text-[#CAC4D0] hover:bg-[#332D41] hover:text-[#E8DEF8]' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
            } transition-colors`}
          >
            <Github className="w-4 h-4" />
            <span>View on GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}