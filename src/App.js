import { useState } from 'react';
import Auth from './components/Auth';
import Chat from './components/Chat';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('chatapp_user');
    if (!stored) return null;
    try {
      // Try to parse as JSON (new format)
      const parsed = JSON.parse(stored);
      // If it's already an object, return it
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed;
      }
      // If it's a string (old format), convert to object
      return { username: parsed, firstName: null, lastName: null };
    } catch {
      // If parsing fails, it's the old string format
      return { username: stored, firstName: null, lastName: null };
    }
  });

  const handleLogin = (userData) => {
    localStorage.setItem('chatapp_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('chatapp_user');
    setUser(null);
  };

  if (user) {
    return <Chat user={user} onLogout={handleLogout} />;
  }
  return <Auth onLogin={handleLogin} />;
}

export default App;
