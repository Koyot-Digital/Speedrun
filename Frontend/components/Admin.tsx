import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner@2.0.3';
import { CheckCircle, XCircle, ExternalLink, LogOut } from 'lucide-react';

type AdminProps = {
  isDarkMode: boolean;
  pendingSubmissions: any[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onLogout: () => void;
};

export function Admin({ isDarkMode, pendingSubmissions, onApprove, onReject, onLogout }: AdminProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleApprove = (id: string) => {
    onApprove(id);
    toast.success('Submission approved');
  };

  const handleReject = (id: string) => {
    onReject(id);
    toast.success('Submission rejected');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl truncate">Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg flex-shrink-0 ${
            isDarkMode 
              ? 'bg-[#4A4458] text-[#E8DEF8] hover:bg-[#5A5468]' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-[#2B2930]' : 'bg-purple-50'}`}>
        <p className={isDarkMode ? 'text-[#E6E0E9]' : 'text-gray-900'}>
          Pending Submissions: <span className={isDarkMode ? 'text-[#D0BCFF]' : 'text-purple-600'}>{pendingSubmissions.length}</span>
        </p>
      </div>

      {pendingSubmissions.length === 0 ? (
        <div className="text-center py-12">
          <p className={isDarkMode ? 'text-[#938F99]' : 'text-gray-500'}>
            No pending submissions to review
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingSubmissions.map((submission) => (
            <div
              key={submission.id}
              className={`rounded-lg p-4 sm:p-6 ${isDarkMode ? 'bg-[#2B2930]' : 'bg-white'} border ${isDarkMode ? 'border-[#4A4458]' : 'border-gray-200'}`}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: submission.avatarColor }}
                >
                  <span className="text-white text-sm sm:text-base">
                    {submission.avatarLetter}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3 gap-3">
                    <div className="min-w-0">
                      <p className={`text-base sm:text-lg truncate ${isDarkMode ? 'text-[#E6E0E9]' : 'text-gray-900'}`}>
                        {submission.username}
                      </p>
                      <p className={`text-sm truncate ${isDarkMode ? 'text-[#938F99]' : 'text-gray-600'}`}>
                        {submission.category} • {submission.score}
                      </p>
                    </div>
                    <span className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm flex-shrink-0 ${
                      isDarkMode 
                        ? 'bg-[#4A4458] text-[#E8DEF8]' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      Pending
                    </span>
                  </div>

                  {submission.proofUrl && (
                    <a
                      href={submission.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 text-sm mb-4 break-all ${
                        isDarkMode ? 'text-[#D0BCFF] hover:text-[#E8DEF8]' : 'text-purple-600 hover:text-purple-700'
                      }`}
                    >
                      <ExternalLink className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">View Proof</span>
                    </a>
                  )}

                  <div className="flex flex-wrap gap-2 sm:gap-3 mt-4">
                    <button
                      onClick={() => handleApprove(submission.id)}
                      className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm ${
                        isDarkMode 
                          ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(submission.id)}
                      className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm ${
                        isDarkMode 
                          ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' 
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>

              <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-[#4A4458]' : 'border-gray-200'}`}>
                <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-[#938F99]' : 'text-gray-500'}`}>
                  Submitted: {new Date(submission.submissionDate).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
