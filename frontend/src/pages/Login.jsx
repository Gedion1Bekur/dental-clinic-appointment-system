import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';
import LiveBackground from '../components/LiveBackground';
import LoadingSpinner from '../components/LoadingSpinner';
import { storage } from '../utils/storage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = storage.getRememberedCredentials();
    if (saved?.email) {
      setEmail(saved.email);
      setPassword(saved.password || '');
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedIn = await login(email, password, rememberMe);
      navigate(loggedIn.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="auth-layout">
        <LiveBackground variant="auth" />
        <LoadingSpinner label="Restoring session…" />
      </div>
    );
  }

  return (
    <div className="auth-layout">
      <LiveBackground variant="auth" />
      <div className="auth-layout__top">
        <ThemeToggle />
      </div>

      <aside className="auth-panel page-enter">
        <Logo />
        <h1 className="auth-panel__title">Precision scheduling for modern dental care.</h1>
        <p className="auth-panel__text">
          Book visits, manage three treatment rooms in parallel, and keep every appointment
          conflict-free — in one workspace.
        </p>
        <ul className="auth-panel__features">
          <li>Real-time room & dentist availability</li>
          <li>Role-based patient & admin access</li>
          <li>Secure session with remember-me</li>
        </ul>
      </aside>

      <div className="auth-form-wrap page-enter" style={{ animationDelay: '80ms' }}>
        <div className="card auth-card">
          <h2 className="auth-card__heading">Sign in</h2>
          <p className="auth-card__sub">Enter your clinic credentials</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="name@clinic.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <label className="form-check">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Keep me signed in on this device
            </label>
            {error && <p className="error-msg">{error}</p>}
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? <span className="btn-loading">Signing in…</span> : 'Sign in'}
            </button>
          </form>
          <p className="auth-card__footer">
            New patient? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
