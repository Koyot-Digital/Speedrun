import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner@2.0.3';
import { Lock } from 'lucide-react';

type LoginProps = {
  isDarkMode: boolean;
  onLogin: (password: string) => Promise<boolean>;
};

export function Login({ isDarkMode, onLogin }: LoginProps) {
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await onLogin(password);
      if (success) {
        navigate('/');
      }
    } catch (error) {
      // Error is handled in the onLogin function
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'bg-[#1C1B1F]' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-md p-6 sm:p-8 rounded-lg ${isDarkMode ? 'bg-[#2B2930]' : 'bg-white'} shadow-lg`}>
        <div className="flex justify-center mb-6">
          <div className={`p-4 rounded-full ${isDarkMode ? 'bg-[#4A4458]' : 'bg-purple-100'}`}>
            <Lock className={`w-6 h-6 sm:w-8 sm:h-8 ${isDarkMode ? 'text-[#D0BCFF]' : 'text-purple-600'}`} />
          </div>
        </div>
        
        <h1 className={`text-xl sm:text-2xl text-center mb-2 ${isDarkMode ? 'text-[#E6E0E9]' : 'text-gray-900'}`}>
          Admin Login
        </h1>
        <p className={`text-sm sm:text-base text-center mb-6 sm:mb-8 ${isDarkMode ? 'text-[#938F99]' : 'text-gray-600'}`}>
          Enter password to access admin panel
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label className={`block mb-2 text-sm sm:text-base ${isDarkMode ? 'text-[#CAC4D0]' : 'text-gray-700'}`}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base ${
                isDarkMode 
                  ? 'bg-[#1C1B1F] border-[#4A4458] text-[#E6E0E9]' 
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              } border outline-none focus:ring-2 focus:ring-purple-500`}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2.5 sm:py-3 rounded-lg text-sm sm:text-base ${
              isDarkMode 
                ? 'bg-[#D0BCFF] text-[#381E72] hover:bg-[#E8DEF8] disabled:opacity-50' 
                : 'bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50'
            } transition-colors disabled:cursor-not-allowed`}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className={`mt-5 sm:mt-6 p-3 sm:p-4 rounded-lg ${isDarkMode ? 'bg-[#1C1B1F]' : 'bg-gray-50'}`}>
          <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-[#938F99]' : 'text-gray-600'}`}>
            Demo credentials: <code className={`${isDarkMode ? 'text-[#D0BCFF]' : 'text-purple-600'} break-all`}>admin123</code>
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className={`w-full mt-4 py-2 text-xs sm:text-sm ${isDarkMode ? 'text-[#CAC4D0] hover:text-[#E6E0E9]' : 'text-gray-600 hover:text-gray-900'}`}
        >
          ← Back to Leaderboard
        </button>
      </div>
    </div>
  );
}