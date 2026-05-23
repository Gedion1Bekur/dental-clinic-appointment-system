import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import { authApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { setUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    authApi
      .me()
      .then(({ user }) => {
        setName(user.name);
        setEmail(user.email);
      })
      .finally(() => setLoadingProfile(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const body = { name, email };
      if (password) body.password = password;
      const { user } = await authApi.updateProfile(body);
      setUser(user);
      setPassword('');
      setMessage('Profile saved successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageHeader title="Account settings" subtitle="Update your name, email, or password" />

      <div className="card card--flat page-narrow">
        {loadingProfile ? (
          <LoadingSpinner label="Loading profile…" />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full name</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
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
              <label htmlFor="password">New password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                placeholder="Leave blank to keep current"
              />
            </div>
            {error && <p className="error-msg">{error}</p>}
            {message && <p className="success-msg">{message}</p>}
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? <span className="btn-loading">Saving…</span> : 'Save changes'}
            </button>
          </form>
        )}
      </div>
    </Layout>
  );
}
