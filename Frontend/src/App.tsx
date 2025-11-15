import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";
import { Leaderboard } from "./components/Leaderboard";
import { SubmitForm } from "./components/SubmitForm";
import { Login } from "./components/Login";
import { Admin } from "./components/Admin";
import { Footer } from "./components/Footer";
import svgPaths from "./imports/svg-y4iefl7a0w";
import * as api from "./services/api";

type LeaderboardEntry = {
  id: string;
  userID: Number;
  category: string;
  score: string;
  avatarURI: string;
  submissionDate: Date;
  status?: string;
  username?: string;
  avatarColor?: string;
  avatarLetter?: string;
  proofUrl?: string;
};

const initialData: LeaderboardEntry[] = [
  {
    id: "1",
    userID: 123456789,
    category: "Meltdown%",
    score: "2:33",
    avatarURI: "https://example.org/favicon.ico",
    submissionDate: new Date("2025-01-15"),
  }
];

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "leaderboard" | "submit" | "rules" | "admin"
  >("leaderboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [approvedEntries, setApprovedEntries] = useState<
    LeaderboardEntry[]
  >([]);
  const [pendingSubmissions, setPendingSubmissions] = useState<
    LeaderboardEntry[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from API on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Load dark mode preference
      const savedDarkMode = localStorage.getItem("darkMode");
      if (savedDarkMode !== null) {
        setIsDarkMode(JSON.parse(savedDarkMode));
      }

      // Check authentication
      const authStatus = api.isAuthenticated();
      setIsAuthenticated(authStatus);

      // Fetch approved leaderboard entries
      try {
        const entries = await api.fetchLeaderboardEntries();
        setApprovedEntries(entries as LeaderboardEntry[]);
      } catch (error) {
        console.error('Failed to load leaderboard entries:', error);
        toast.error('Cannot connect to API - Using cached data');
        // Fallback to localStorage
        const savedApproved = localStorage.getItem("approvedEntries");
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
      }

      // Fetch pending submissions if authenticated
      if (authStatus) {
        try {
          const submissions = await api.fetchPendingSubmissions();
          setPendingSubmissions(submissions as LeaderboardEntry[]);
        } catch (error) {
          console.error('Failed to load pending submissions:', error);
          toast.error('Cannot connect to API - Using cached submissions');
          // Fallback to localStorage
          const savedPending = localStorage.getItem("pendingSubmissions");
          if (savedPending) {
            const parsed = JSON.parse(savedPending);
            setPendingSubmissions(
              parsed.map((e: any) => ({
                ...e,
                submissionDate: new Date(e.submissionDate),
              })),
            );
          }
        }
      }

      setIsLoading(false);
    };

    loadData();
  }, []);

  // Reload pending submissions when authentication status changes
  useEffect(() => {
    const loadPendingSubmissions = async () => {
      if (isAuthenticated) {
        try {
          const submissions = await api.fetchPendingSubmissions();
          setPendingSubmissions(submissions as LeaderboardEntry[]);
        } catch (error) {
          console.error('Failed to load pending submissions:', error);
        }
      } else {
        setPendingSubmissions([]);
      }
    };

    if (isAuthenticated) {
      loadPendingSubmissions();
    }
  }, [isAuthenticated]);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem(
      "darkMode",
      JSON.stringify(isDarkMode),
    );
  }, [isDarkMode]);

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

  const handleSubmission = async (submission: any) => {
    try {
      await api.submitEntry({
        username: submission.username,
        category: submission.category,
        score: submission.score,
        proofUrl: submission.proofUrl,
      });
      toast.success('Submission sent for review!');
    } catch (error) {
      toast.error('Cannot connect to API - Submission saved locally');
      console.error('Submission error:', error);
      // Fallback to local state
      setPendingSubmissions([...pendingSubmissions, submission]);
      toast.info('Your submission will be synced when connection is restored');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.approveSubmission(id);
      
      // Update local state
      const submission = pendingSubmissions.find((s) => s.id === id);
      if (submission) {
        const approved = { ...submission };
        delete approved.status;
        setApprovedEntries([...approvedEntries, approved]);
        setPendingSubmissions(pendingSubmissions.filter((s) => s.id !== id));
      }
      
      // Refresh data from API
      try {
        const entries = await api.fetchLeaderboardEntries();
        setApprovedEntries(entries as LeaderboardEntry[]);
      } catch (error) {
        console.error('Failed to refresh leaderboard:', error);
      }
    } catch (error) {
      toast.error('Failed to approve submission');
      console.error('Approve error:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.rejectSubmission(id);
      
      // Update local state
      setPendingSubmissions(pendingSubmissions.filter((s) => s.id !== id));
    } catch (error) {
      toast.error('Failed to reject submission');
      console.error('Reject error:', error);
    }
  };

  const handleLogin = async (password: string) => {
    try {
      await api.login(password);
      setIsAuthenticated(true);
      toast.success('Logged in successfully');
      return true;
    } catch (error) {
      toast.error('Invalid credentials');
      console.error('Login error:', error);
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      setIsAuthenticated(false);
      setPendingSubmissions([]);
    } catch (error) {
      console.error('Logout error:', error);
      setIsAuthenticated(false);
      setPendingSubmissions([]);
    }
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
                  {isAuthenticated && (
                    <button
                      onClick={() => setActiveTab("admin")}
                      className={`flex items-center gap-2 px-3 sm:px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${
                        activeTab === "admin"
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
                          d="M8 0C6.9 0 6 0.9 6 2C6 3.1 6.9 4 8 4C9.1 4 10 3.1 10 2C10 0.9 9.1 0 8 0ZM8 14C6.9 14 6 14.9 6 16C6 17.1 6.9 18 8 18C9.1 18 10 17.1 10 16C10 14.9 9.1 14 8 14ZM8 7C6.9 7 6 7.9 6 9C6 10.1 6.9 11 8 11C9.1 11 10 10.1 10 9C10 7.9 9.1 7 8 7Z"
                          fill="currentColor"
                          transform="scale(0.5) translate(8, 0)"
                        />
                      </svg>
                      Admin
                    </button>
                  )}
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

                {activeTab === "admin" && (
                  <Admin
                    isDarkMode={isDarkMode}
                    pendingSubmissions={pendingSubmissions}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onLogout={handleLogout}
                  />
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
        <Footer isDarkMode={isDarkMode} />
      </div>
    </BrowserRouter>
  );
}

export default App;