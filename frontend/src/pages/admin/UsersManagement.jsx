import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import { usersApi } from '../../services/api';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'patient' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    usersApi
      .list()
      .then((data) => setUsers(data.users))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (user) => {
    setEditing(user);
    setForm({ name: user.name, email: user.email, role: user.role });
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      await usersApi.update(editing.id, form);
      setEditing(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await usersApi.remove(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Layout>
      <PageHeader
        title="User accounts"
        subtitle="Manage patient and administrator access"
        badge={`${users.length} users`}
      />

      {error && <p className="error-msg page-alert">{error}</p>}

      <div className="card card--flat data-panel">
        {loading ? (
          <LoadingSpinner label="Loading users…" />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th className="data-table__actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td data-label="Name">
                      <span className="cell-primary">{u.name}</span>
                    </td>
                    <td data-label="Email">{u.email}</td>
                    <td data-label="Role">
                      <span className={`role-pill role-pill--${u.role}`}>{u.role}</span>
                    </td>
                    <td data-label="Actions" className="data-table__actions-col">
                      <div className="action-group">
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEdit(u)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => remove(u.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal__title">Edit user</h2>
            <form onSubmit={save}>
              <div className="form-group">
                <label>Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="patient">Patient</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setEditing(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
