import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';
import LiveBackground from '../components/LiveBackground';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password, rememberMe);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <LiveBackground variant="auth" />
      <div className="auth-layout__top">
        <ThemeToggle />
      </div>

      <aside className="auth-panel page-enter">
        <Logo />
        <h1 className="auth-panel__title">Join as a patient.</h1>
        <p className="auth-panel__text">
          Register once, then book treatments with available dentists and automatic room
          assignment.
        </p>
      </aside>

      <div className="auth-form-wrap page-enter" style={{ animationDelay: '80ms' }}>
        <div className="card auth-card">
          <h2 className="auth-card__heading">Create account</h2>
          <p className="auth-card__sub">Patient registration only</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                minLength={8}
                placeholder="Minimum 8 characters"
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
              {loading ? <span className="btn-loading">Creating account…</span> : 'Register'}
            </button>
          </form>
          <p className="auth-card__footer">
            Already registered? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
