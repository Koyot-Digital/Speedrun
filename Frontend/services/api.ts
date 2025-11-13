const API_BASE_URL = 'https://speedrun.koyot.digital/api/v1';

export type LeaderboardEntry = {
  id: string;
  userID: number;
  category: string;
  score: string;
  avatarURI: string;
  submissionDate: Date | string;
  username?: string;
  avatarColor?: string;
  avatarLetter?: string;
  proofUrl?: string;
};

export type SubmissionData = {
  username: string;
  category: string;
  score: string;
  proofUrl?: string;
};

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Set auth token in localStorage
const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

// Remove auth token from localStorage
const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};
/*
this is the most important funcion in the app.

it gets the leaderboard data
*/
export const fetchLeaderboardEntries = async (): Promise<LeaderboardEntry[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/entries`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard entries');
    }

    const data = await response.json();
    return data.map((entry: any) => ({
      ...entry,
      submissionDate: new Date(entry.submissionDate),
    }));
  } catch (error) {
    console.error('Error fetching leaderboard entries:', error);
    throw error;
  }
};

// Fetch pending submissions (admin only)
export const fetchPendingSubmissions = async (): Promise<LeaderboardEntry[]> => {
  const token = getAuthToken();
  
  try {
    const response = await fetch(`${API_BASE_URL}/submissions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch pending submissions');
    }

    const data = await response.json();
    return data.map((entry: any) => ({
      ...entry,
      submissionDate: new Date(entry.submissionDate),
    }));
  } catch (error) {
    console.error('Error fetching pending submissions:', error);
    throw error;
  }
};

// Submit a new entry
export const submitEntry = async (submission: SubmissionData): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...submission,
        submissionDate: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit entry');
    }
  } catch (error) {
    console.error('Error submitting entry:', error);
    throw error;
  }
};

// Admin login
export const login = async (password: string): Promise<{ token: string; success: boolean }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    
    if (data.token) {
      setAuthToken(data.token);
    }
    
    return { token: data.token, success: true };
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};
// Approve a submission
export const approveSubmission = async (id: string): Promise<void> => {
  const token = getAuthToken();
  
  try {
    const response = await fetch(`${API_BASE_URL}/submission/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(id),
    });

    if (!response.ok) {
      throw new Error('Failed to approve submission');
    }
  } catch (error) {
    console.error('Error approving submission:', error);
    throw error;
  }
};

// Reject a submission
export const rejectSubmission = async (id: string): Promise<void> => {
  const token = getAuthToken();
  
  try {
    const response = await fetch(`${API_BASE_URL}/submissions/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: id,
    });

    if (!response.ok) {
      throw new Error('Failed to reject submission, please make a bug report on the github.');
    }
  } catch (error) {
    console.error('Error rejecting submission:', error);
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export { getAuthToken, setAuthToken, removeAuthToken };
