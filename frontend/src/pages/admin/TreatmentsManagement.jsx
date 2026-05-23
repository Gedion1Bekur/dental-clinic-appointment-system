import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import { treatmentsApi } from '../../services/api';
import { formatPrice } from '../../utils/format';

export default function TreatmentsManagement() {
  const [treatments, setTreatments] = useState([]);
  const [form, setForm] = useState({ name: '', durationMinutes: 30, price: 100 });
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    treatmentsApi
      .list()
      .then((data) => setTreatments(data.treatments))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const body = {
        name: form.name,
        durationMinutes: Number(form.durationMinutes),
        price: Number(form.price),
      };
      if (editing) {
        await treatmentsApi.update(editing.id, body);
        setEditing(null);
      } else {
        await treatmentsApi.create(body);
      }
      setForm({ name: '', durationMinutes: 30, price: 100 });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this treatment?')) return;
    try {
      await treatmentsApi.remove(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Layout>
      <PageHeader
        title="Treatments"
        subtitle="Service catalog with duration and pricing (PLN)"
        badge={`${treatments.length} services`}
      />

      {error && <p className="error-msg page-alert">{error}</p>}

      <div className="page-split">
        <div className="card card--flat form-panel">
          <h2 className="form-panel__title">{editing ? 'Edit treatment' : 'Add treatment'}</h2>
          <form onSubmit={submit}>
            <div className="form-group">
              <label>Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Duration (minutes)</label>
              <input
                type="number"
                min={1}
                value={form.durationMinutes}
                onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Price (zł)</label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editing ? 'Update' : 'Add treatment'}
              </button>
              {editing && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditing(null);
                    setForm({ name: '', durationMinutes: 30, price: 100 });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="data-panel">
          {loading ? (
            <div className="card card--flat">
              <LoadingSpinner label="Loading treatments…" />
            </div>
          ) : (
            <div className="card card--flat">
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Duration</th>
                      <th>Price</th>
                      <th className="data-table__actions-col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {treatments.map((t) => (
                      <tr key={t.id}>
                        <td data-label="Name">
                          <span className="cell-primary">{t.name}</span>
                        </td>
                        <td data-label="Duration">{t.duration_minutes} min</td>
                        <td data-label="Price">{formatPrice(t.price)}</td>
                        <td data-label="Actions" className="data-table__actions-col">
                          <div className="action-group">
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => {
                                setEditing(t);
                                setForm({
                                  name: t.name,
                                  durationMinutes: t.duration_minutes,
                                  price: t.price,
                                });
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => remove(t.id)}
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
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
