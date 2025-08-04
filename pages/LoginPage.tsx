


import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/Card';
import { ShipIcon } from '../components/icons/ShipIcon';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, authenticatedUser } = useAuth();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(username, password);

    if (success) {
      // The user object is set after login, but might not be available immediately.
      // We can peek at the role based on the username for immediate redirection.
      if (username === 'johndoe') {
         navigate('/ecrew', { replace: true });
      } else {
         navigate(from, { replace: true });
      }
    } else {
      setError('Invalid username or password. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <ShipIcon className="h-16 w-16 mx-auto text-primary-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground mt-4">CMS Pro</h1>
            <p className="text-muted-foreground">Please sign in to continue</p>
        </div>
        <Card>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-muted-foreground"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full p-3 bg-gray-100 dark:bg-muted border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none text-gray-900 dark:text-card-foreground"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-muted-foreground"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full p-3 bg-gray-100 dark:bg-muted border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none text-gray-900 dark:text-card-foreground"
              />
            </div>
            
            {error && (
                <div className="text-center text-red-500 text-sm">
                    {error}
                </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-800 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </Card>
        <p className="text-center text-xs text-muted-foreground mt-4">
            Demo credentials (pw: password): admin, manager, officer, johndoe (crew)
        </p>
      </div>
    </div>
  );
};

export default LoginPage;