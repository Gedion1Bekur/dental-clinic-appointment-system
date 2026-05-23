import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import { dentistsApi, treatmentsApi } from '../../services/api';

export default function DentistsManagement() {
  const [dentists, setDentists] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [form, setForm] = useState({ name: '', specialization: '' });
  const [editing, setEditing] = useState(null);
  const [assignModal, setAssignModal] = useState(null);
  const [treatmentId, setTreatmentId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([dentistsApi.list(), treatmentsApi.list()])
      .then(([d, t]) => {
        setDentists(d.dentists);
        setTreatments(t.treatments);
      })
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
      if (editing) {
        await dentistsApi.update(editing.id, form);
        setEditing(null);
      } else {
        await dentistsApi.create(form);
      }
      setForm({ name: '', specialization: '' });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this dentist?')) return;
    try {
      await dentistsApi.remove(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const assign = async (e) => {
    e.preventDefault();
    try {
      await dentistsApi.assignTreatment(assignModal.id, Number(treatmentId));
      setAssignModal(null);
      setTreatmentId('');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const unassign = async (dentistId, tid) => {
    try {
      await dentistsApi.removeTreatment(dentistId, tid);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Layout>
      <PageHeader
        title="Dentists"
        subtitle="Staff profiles and treatment assignments"
        badge={`${dentists.length} on staff`}
      />

      {error && <p className="error-msg page-alert">{error}</p>}

      <div className="page-split">
        <div className="card card--flat form-panel">
          <h2 className="form-panel__title">{editing ? 'Edit dentist' : 'Add dentist'}</h2>
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
              <label>Specialization</label>
              <input
                value={form.specialization}
                onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editing ? 'Update' : 'Add dentist'}
              </button>
              {editing && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditing(null);
                    setForm({ name: '', specialization: '' });
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
              <LoadingSpinner label="Loading dentists…" />
            </div>
          ) : (
            <div className="card card--flat">
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Specialization</th>
                      <th>Treatments</th>
                      <th className="data-table__actions-col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dentists.map((d) => (
                      <tr key={d.id}>
                        <td data-label="Name">
                          <span className="cell-primary">{d.name}</span>
                        </td>
                        <td data-label="Specialization">{d.specialization}</td>
                        <td data-label="Treatments">
                          <div className="tag-list">
                            {(d.treatments || []).map((t) => (
                              <span key={t.id} className="tag">
                                {t.name}
                                <button
                                  type="button"
                                  className="tag__remove"
                                  onClick={() => unassign(d.id, t.id)}
                                  aria-label={`Remove ${t.name}`}
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </td>
                        <td data-label="Actions" className="data-table__actions-col">
                          <div className="action-group">
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => {
                                setEditing(d);
                                setForm({ name: d.name, specialization: d.specialization });
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm"
                              onClick={() => setAssignModal(d)}
                            >
                              Assign
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => remove(d.id)}
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

      {assignModal && (
        <div className="modal-overlay" onClick={() => setAssignModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal__title">Assign treatment — {assignModal.name}</h2>
            <form onSubmit={assign}>
              <div className="form-group">
                <label>Treatment</label>
                <select
                  value={treatmentId}
                  onChange={(e) => setTreatmentId(e.target.value)}
                  required
                >
                  <option value="">Select treatment</option>
                  {treatments.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setAssignModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
