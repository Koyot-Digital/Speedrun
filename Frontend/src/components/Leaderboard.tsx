import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import svgPaths from "../imports/svg-y4iefl7a0w";
import img from "figma:asset/cdcad6974008a09fa518d991b491c95dface759b.png";

type LeaderboardEntry = {
  id: Number;
  userID: Number;
  category: string;
  score: string;
  avatarURI: string;
  submissionDate: Date;
  proofUrl?: URL;
};

type LeaderboardProps = {
  isDarkMode: boolean;
  entries: LeaderboardEntry[];
};

export function Leaderboard({ isDarkMode, entries }: LeaderboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Meltdown%');
  const [sortBy, setSortBy] = useState('completion');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const categories = ['Meltdown%', 'Eff%', 'Die%', 'Startup%'];
  const sortOptions = [
    { id: 'completion', label: 'Sort By Completion Time', icon: svgPaths.p23d7df00 },
    { id: 'name', label: 'Sort By Name', icon: svgPaths.p2a106080 },
    { id: 'submission', label: 'Sort By Submission Date', icon: svgPaths.p2d58a100 },
  ];

  const filteredAndSortedData = entries
    .filter(entry => {
      const matchesSearch = entry.userID.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = entry.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.userID.localeCompare(b.userID);
      } else if (sortBy === 'submission') {
        comparison = a.submissionDate.getTime() - b.submissionDate.getTime();
      } else {
        comparison = a.score.localeCompare(b.score);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  return (
    <>
      {/* Search Field */}
      <div className="mb-6">
        <div className={`relative rounded-lg ${isDarkMode ? 'bg-[#2B2930]' : 'bg-gray-100'} border ${isDarkMode ? 'border-[#4A4458]' : 'border-gray-300'}`}>
          <div className="flex items-center px-4 py-3">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="w-5 h-5 mr-3">
              <path d={svgPaths.p16b4a380} fill="#CAC4D0" />
            </svg>
            <input
              type="text"
              placeholder="@Builderman"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-[#E6E0E9] placeholder-[#938F99]' : 'text-gray-900 placeholder-gray-500'}`}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="ml-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d={svgPaths.p20c08740} fill="#CAC4D0" />
                </svg>
              </button>
            )}
          </div>
          <div className={`absolute -top-2 left-3 px-1 text-xs ${isDarkMode ? 'bg-[#2B2930] text-[#CAC4D0]' : 'bg-gray-100 text-gray-600'}`}>
            Search By Display name
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              selectedCategory === category
                ? isDarkMode ? 'bg-[#4A4458] text-[#E8DEF8]' : 'bg-purple-200 text-purple-900'
                : isDarkMode ? 'bg-transparent border border-[#4A4458] text-[#CAC4D0] hover:bg-[#2A2730]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {selectedCategory === category && (
              <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
                <path d={svgPaths.p1971e00} fill="currentColor" />
              </svg>
            )}
            {category}
          </button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sortOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setSortBy(option.id)}
            className={`px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm ${
              sortBy === option.id
                ? isDarkMode ? 'bg-[#4A4458] text-[#E8DEF8]' : 'bg-purple-200 text-purple-900'
                : isDarkMode ? 'bg-transparent border border-[#4A4458] text-[#CAC4D0] hover:bg-[#2A2730]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="flex-shrink-0">
              <path d={option.icon} fill="currentColor" />
            </svg>
            <span className="hidden sm:inline">{option.label}</span>
            <span className="sm:hidden">
              {option.id === 'completion' && 'Time'}
              {option.id === 'name' && 'Name'}
              {option.id === 'submission' && 'Date'}
            </span>
          </button>
        ))}
      </div>

      {/* Sort Direction */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSortDirection('desc')}
          className={`px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm ${
            sortDirection === 'desc'
              ? isDarkMode ? 'bg-[#4A4458] text-[#E8DEF8]' : 'bg-purple-200 text-purple-900'
              : isDarkMode ? 'bg-transparent border border-[#4A4458] text-[#CAC4D0] hover:bg-[#2A2730]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {sortDirection === 'desc' && (
            <svg width="13" height="10" viewBox="0 0 13 10" fill="none" className="flex-shrink-0">
              <path d={svgPaths.p1971e00} fill="currentColor" />
            </svg>
          )}
          <span className="hidden sm:inline">Sort Descending</span>
          <span className="sm:hidden">Desc</span>
        </button>
        <button
          onClick={() => setSortDirection('asc')}
          className={`px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm ${
            sortDirection === 'asc'
              ? isDarkMode ? 'bg-[#4A4458] text-[#E8DEF8]' : 'bg-purple-200 text-purple-900'
              : isDarkMode ? 'bg-transparent border border-[#4A4458] text-[#CAC4D0] hover:bg-[#2A2730]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <svg width="9" height="6" viewBox="0 0 9 6" fill="none" className="flex-shrink-0">
            <path d={svgPaths.p31e5a700} fill="currentColor" />
          </svg>
          <span className="hidden sm:inline">Sort Ascending</span>
          <span className="sm:hidden">Asc</span>
        </button>
      </div>

      {/* Leaderboard Entries */}
      <div className="space-y-3 sm:space-y-4">
        {filteredAndSortedData.length > 0 ? (
          filteredAndSortedData.map((entry, index) => (
            <div
              key={entry.id}
              className={`rounded-lg p-3 sm:p-4 ${isDarkMode ? 'bg-[#2B2930]' : 'bg-gray-50'} hover:${isDarkMode ? 'bg-[#332D41]' : 'bg-gray-100'} transition-colors`}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: entry.avatarColor }}
                  >
                    <span className={`text-sm sm:text-base ${entry.avatarColor === '#EADDFF' || entry.avatarColor.includes('#') && parseInt(entry.avatarColor.slice(1), 16) > 0x888888 ? 'text-gray-900' : 'text-white'}`}>
                      {entry.avatarLetter}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm sm:text-base truncate ${isDarkMode ? 'text-[#E6E0E9]' : 'text-gray-900'}`}>
                        {entry.score} - {entry.category}
                      </p>
                      {entry.proofUrl && (
                        <a
                          href={entry.proofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex-shrink-0 ${isDarkMode ? 'text-[#D0BCFF] hover:text-[#E8DEF8]' : 'text-purple-600 hover:text-purple-700'}`}
                          title="View proof video"
                        >
                          <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </a>
                      )}
                    </div>
                    <p className={`text-xs sm:text-sm truncate ${isDarkMode ? 'text-[#938F99]' : 'text-gray-600'}`}>
                      {entry.userID}
                    </p>
                  </div>
                </div>
                <div className={`px-2 sm:px-3 py-1 rounded flex-shrink-0 ${isDarkMode ? 'bg-[#4A4458]' : 'bg-gray-200'}`}>
                  <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-[#E8DEF8]' : 'text-gray-700'}`}>
                    #{index + 1}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className={isDarkMode ? 'text-[#938F99]' : 'text-gray-500'}>
              No entries found for the selected filters
            </p>
          </div>
        )}
      </div>
    </>
  );
}