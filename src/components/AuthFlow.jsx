import { useState } from 'react';
import UserDashboard from './UserDashboard';

export default function AuthFlow() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      // 1. Post login data to FastAPI backend token route
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch('http://localhost:8000/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      if (!response.ok) throw new Error('Invalid username or password.');

      const data = await response.json();
      
      // 2. Save token locally
      localStorage.setItem('access_token', data.access_token);

      // 3. Fetch user profile data from FastAPI
      const profileResponse = await fetch('http://localhost:8000/users/me', {
        headers: { 'Authorization': `Bearer ${data.access_token}` }
      });

      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        setUserData(profile);
      } else {
        setUserData({ name: username });
      }

      setIsLoggedIn(true);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to connect to backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
    setUserData(null);
  };

  if (isLoggedIn) {
    return (
      <div>
        <div className="max-w-7xl mx-auto px-4 pt-4 flex justify-end">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Sign Out
          </button>
        </div>
        <UserDashboard 
          userName={userData?.name || username} 
          userEmail={userData?.email} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 bg-[#0a0f1d] rounded-3xl border border-slate-800 shadow-2xl">
        <h2 className="text-2xl font-extrabold text-white mb-2 text-center">Sign In</h2>
        
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#070b14] border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#070b14] border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}