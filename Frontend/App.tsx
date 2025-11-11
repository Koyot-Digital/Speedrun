import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { Toaster } from "./components/ui/sonner";
import { Leaderboard } from "./components/Leaderboard";
import { SubmitForm } from "./components/SubmitForm";
import { Login } from "./components/Login";
import { Admin } from "./components/Admin";
import svgPaths from "./imports/svg-y4iefl7a0w";

type LeaderboardEntry = {
  id: string;
  username: string;
  category: string;
  score: string;
  avatarColor: string;
  avatarLetter: string;
  submissionDate: Date;
  status?: string;
};

const initialData: LeaderboardEntry[] = [
  {
    id: "1",
    username: "@Builderman",
    category: "Meltdown%",
    score: "2:33",
    avatarColor: "#000000",
    avatarLetter: "B",
    submissionDate: new Date("2025-01-15"),
  },
  {
    id: "2",
    username: "@Builderman",
    category: "Eff%",
    score: "190%",
    avatarColor: "#EADDFF",
    avatarLetter: "B",
    submissionDate: new Date("2025-02-10"),
  },
  {
    id: "3",
    username: "@Builderman",
    category: "Die%",
    score: "0:00.2",
    avatarColor: "#000000",
    avatarLetter: "B",
    submissionDate: new Date("2025-01-20"),
  },
  {
    id: "4",
    username: "@SpeedRunner",
    category: "Meltdown%",
    score: "2:45",
    avatarColor: "#FF6B6B",
    avatarLetter: "S",
    submissionDate: new Date("2025-02-01"),
  },
  {
    id: "5",
    username: "@ProGamer",
    category: "Eff%",
    score: "185%",
    avatarColor: "#4ECDC4",
    avatarLetter: "P",
    submissionDate: new Date("2025-01-25"),
  },
  {
    id: "6",
    username: "@NinjaMaster",
    category: "Startup%",
    score: "0:15.3",
    avatarColor: "#95E1D3",
    avatarLetter: "N",
    submissionDate: new Date("2025-02-05"),
  },
  {
    id: "7",
    username: "@Speedster",
    category: "Die%",
    score: "0:00.5",
    avatarColor: "#F38181",
    avatarLetter: "S",
    submissionDate: new Date("2025-01-18"),
  },
  {
    id: "8",
    username: "@Champion",
    category: "Meltdown%",
    score: "2:28",
    avatarColor: "#AA96DA",
    avatarLetter: "C",
    submissionDate: new Date("2025-02-12"),
  },
];

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "leaderboard" | "submit" | "rules"
  >("leaderboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [approvedEntries, setApprovedEntries] = useState<
    LeaderboardEntry[]
  >([]);
  const [pendingSubmissions, setPendingSubmissions] = useState<
    LeaderboardEntry[]
  >([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }

    const savedAuth = localStorage.getItem("isAuthenticated");
    if (savedAuth) {
      setIsAuthenticated(JSON.parse(savedAuth));
    }

    const savedApproved = localStorage.getItem(
      "approvedEntries",
    );
    if (savedApproved) {
      const parsed = JSON.parse(savedApproved);
      setApprovedEntries(
        parsed.map((e: any) => ({
          ...e,
          submissionDate: new Date(e.submissionDate),
        })),
      );
    } else {
      setApprovedEntries(initialData);
    }

    const savedPending = localStorage.getItem(
      "pendingSubmissions",
    );
    if (savedPending) {
      const parsed = JSON.parse(savedPending);
      setPendingSubmissions(
        parsed.map((e: any) => ({
          ...e,
          submissionDate: new Date(e.submissionDate),
        })),
      );
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem(
      "darkMode",
      JSON.stringify(isDarkMode),
    );
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem(
      "isAuthenticated",
      JSON.stringify(isAuthenticated),
    );
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(
      "approvedEntries",
      JSON.stringify(approvedEntries),
    );
  }, [approvedEntries]);

  useEffect(() => {
    localStorage.setItem(
      "pendingSubmissions",
      JSON.stringify(pendingSubmissions),
    );
  }, [pendingSubmissions]);

  const handleSubmission = (submission: LeaderboardEntry) => {
    setPendingSubmissions([...pendingSubmissions, submission]);
  };

  const handleApprove = (id: string) => {
    const submission = pendingSubmissions.find(
      (s) => s.id === id,
    );
    if (submission) {
      const approved = { ...submission, status: "approved" };
      delete approved.status;
      setApprovedEntries([...approvedEntries, approved]);
      setPendingSubmissions(
        pendingSubmissions.filter((s) => s.id !== id),
      );
    }
  };

  const handleReject = (id: string) => {
    setPendingSubmissions(
      pendingSubmissions.filter((s) => s.id !== id),
    );
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <div
        className={`min-h-screen ${isDarkMode ? "bg-[#1C1B1F] text-[#E6E0E9]" : "bg-white text-[#1C1B1F]"}`}
      >
        <Routes>
          <Route
            path="/login"
            element={
              <Login
                isDarkMode={isDarkMode}
                onLogin={handleLogin}
              />
            }
          />

          <Route
            path="/admin"
            element={
              isAuthenticated ? (
                <div className="max-w-6xl mx-auto p-4 sm:p-6">
                  <div className="flex justify-between items-center mb-6 gap-4">
                    <h1 className="text-xl sm:text-2xl truncate">
                      ONPS Leaderboard - Admin
                    </h1>
                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className={`p-3 rounded-full flex-shrink-0 ${isDarkMode ? "bg-[#332D41] hover:bg-[#4A4458]" : "bg-gray-200 hover:bg-gray-300"}`}
                    >
                      {isDarkMode ? (
                        <Sun className="w-5 h-5" />
                      ) : (
                        <Moon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <Admin
                    isDarkMode={isDarkMode}
                    pendingSubmissions={pendingSubmissions}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onLogout={handleLogout}
                  />
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/"
            element={
              <div className="max-w-6xl mx-auto p-4 sm:p-6">
                <div className="flex justify-between items-center mb-6 gap-4">
                  <h1 className="text-xl sm:text-2xl truncate">
                    ONPS Leaderboard
                  </h1>
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`p-3 rounded-full flex-shrink-0 ${isDarkMode ? "bg-[#332D41] hover:bg-[#4A4458]" : "bg-gray-200 hover:bg-gray-300"}`}
                  >
                    {isDarkMode ? (
                      <Sun className="w-5 h-5" />
                    ) : (
                      <Moon className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  <button
                    onClick={() => setActiveTab("leaderboard")}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${
                      activeTab === "leaderboard"
                        ? isDarkMode
                          ? "bg-[#332D41] text-[#E8DEF8]"
                          : "bg-purple-100 text-purple-900"
                        : isDarkMode
                          ? "bg-transparent text-[#4A4458] hover:bg-[#2A2730]"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <svg
                      width="18"
                      height="10"
                      viewBox="0 0 18 10"
                      fill="none"
                      className="flex-shrink-0"
                    >
                      <path
                        d={svgPaths.p12e8bcf0}
                        fill="currentColor"
                      />
                    </svg>
                    <span className="hidden sm:inline">
                      Leaderboard
                    </span>
                    <span className="sm:hidden">Board</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("submit")}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${
                      activeTab === "submit"
                        ? isDarkMode
                          ? "bg-[#332D41] text-[#E8DEF8]"
                          : "bg-purple-100 text-purple-900"
                        : isDarkMode
                          ? "bg-transparent text-[#4A4458] hover:bg-[#2A2730]"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="flex-shrink-0"
                    >
                      <path
                        d={svgPaths.p3fc73f80}
                        fill="currentColor"
                      />
                    </svg>
                    Submit
                  </button>
                  <button
                    onClick={() => setActiveTab("rules")}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${
                      activeTab === "rules"
                        ? isDarkMode
                          ? "bg-[#332D41] text-[#E8DEF8]"
                          : "bg-purple-100 text-purple-900"
                        : isDarkMode
                          ? "bg-transparent text-[#4A4458] hover:bg-[#2A2730]"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <svg
                      width="18"
                      height="12"
                      viewBox="0 0 18 12"
                      fill="none"
                      className="flex-shrink-0"
                    >
                      <path
                        d={svgPaths.p2304a600}
                        fill="currentColor"
                      />
                    </svg>
                    Rules
                  </button>
                </div>

                {activeTab === "leaderboard" && (
                  <Leaderboard
                    isDarkMode={isDarkMode}
                    entries={approvedEntries}
                  />
                )}

                {activeTab === "submit" && (
                  <SubmitForm
                    isDarkMode={isDarkMode}
                    onSubmit={handleSubmission}
                  />
                )}

                {activeTab === "rules" && (
                  <div className="py-6">
                    <h2 className="text-2xl mb-6">
                      Competition Rules
                    </h2>
                    <div className="space-y-4">
                      <div
                        className={`p-4 rounded-lg ${isDarkMode ? "bg-[#2B2930]" : "bg-gray-50"}`}
                      >
                        <h3 className="mb-2">Meltdown%</h3>
                        <p
                          className={
                            isDarkMode
                              ? "text-[#938F99]"
                              : "text-gray-600"
                          }
                        >
                          Complete the meltdown sequence as fast
                          as possible.
                        </p>
                      </div>
                      <div
                        className={`p-4 rounded-lg ${isDarkMode ? "bg-[#2B2930]" : "bg-gray-50"}`}
                      >
                        <h3 className="mb-2">Eff%</h3>
                        <p
                          className={
                            isDarkMode
                              ? "text-[#938F99]"
                              : "text-gray-600"
                          }
                        >
                          Achieve maximum efficiency rating
                          during gameplay.
                        </p>
                      </div>
                      <div
                        className={`p-4 rounded-lg ${isDarkMode ? "bg-[#2B2930]" : "bg-gray-50"}`}
                      >
                        <h3 className="mb-2">Die%</h3>
                        <p
                          className={
                            isDarkMode
                              ? "text-[#938F99]"
                              : "text-gray-600"
                          }
                        >
                          Speedrun to death as quickly as
                          possible.
                        </p>
                      </div>
                      <div
                        className={`p-4 rounded-lg ${isDarkMode ? "bg-[#2B2930]" : "bg-gray-50"}`}
                      >
                        <h3 className="mb-2">Startup%</h3>
                        <p
                          className={
                            isDarkMode
                              ? "text-[#938F99]"
                              : "text-gray-600"
                          }
                        >
                          Complete the startup sequence in
                          record time.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            }
          />

          {/* Catch-all route for any unmatched paths */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
        <Toaster theme={isDarkMode ? "dark" : "light"} />
      </div>
    </BrowserRouter>
  );
}

export default App;