import { useEffect, useState, useMemo } from 'react';
import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import Icon from '../../components/icons/Icon';
import { appointmentsApi, dentistsApi } from '../../services/api';
import { formatDateTime } from '../../utils/format';

export default function AppointmentsOverview() {
  const [appointments, setAppointments] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [filters, setFilters] = useState({
    dentistId: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const params = {};
    if (filters.dentistId) params.dentistId = filters.dentistId;
    if (filters.status) params.status = filters.status;
    if (filters.dateFrom) params.dateFrom = new Date(filters.dateFrom).toISOString();
    if (filters.dateTo) {
      const end = new Date(filters.dateTo);
      end.setHours(23, 59, 59, 999);
      params.dateTo = end.toISOString();
    }
    appointmentsApi
      .list(params)
      .then((data) => setAppointments(data.appointments))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    dentistsApi.list().then((data) => setDentists(data.dentists));
  }, []);

  useEffect(() => {
    load();
  }, []);

  const counts = useMemo(
    () => ({
      scheduled: appointments.filter((a) => a.status === 'scheduled').length,
      completed: appointments.filter((a) => a.status === 'completed').length,
      cancelled: appointments.filter((a) => a.status === 'cancelled').length,
    }),
    [appointments]
  );

  const clearFilters = () => {
    setFilters({ dentistId: '', status: '', dateFrom: '', dateTo: '' });
  };

  const updateStatus = async (id, status) => {
    try {
      await appointmentsApi.update(id, { status });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this appointment?')) return;
    try {
      await appointmentsApi.remove(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Layout>
      <PageHeader
        title="Appointment schedule"
        subtitle="Manage all clinic bookings across 3 treatment rooms"
        badge={`${appointments.length} total`}
      />

      {error && <p className="error-msg page-alert">{error}</p>}

      <div className="status-tabs">
        <div className="status-tab status-tab--scheduled">
          <span className="status-tab__count">{counts.scheduled}</span>
          <span className="status-tab__label">Scheduled</span>
        </div>
        <div className="status-tab status-tab--completed">
          <span className="status-tab__count">{counts.completed}</span>
          <span className="status-tab__label">Completed</span>
        </div>
        <div className="status-tab status-tab--cancelled">
          <span className="status-tab__count">{counts.cancelled}</span>
          <span className="status-tab__label">Cancelled</span>
        </div>
      </div>

      <div className="filter-panel card card--flat">
        <div className="filter-panel__head">
          <h2 className="filter-panel__title">Filters</h2>
          <button type="button" className="btn btn-ghost btn-sm" onClick={clearFilters}>
            Clear all
          </button>
        </div>
        <div className="filter-panel__grid">
          <div className="form-group">
            <label htmlFor="filter-dentist">Dentist</label>
            <select
              id="filter-dentist"
              value={filters.dentistId}
              onChange={(e) => setFilters({ ...filters, dentistId: e.target.value })}
            >
              <option value="">All dentists</option>
              {dentists.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="filter-status">Status</label>
            <select
              id="filter-status"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="filter-from">From date</label>
            <input
              id="filter-from"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="filter-to">To date</label>
            <input
              id="filter-to"
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            />
          </div>
        </div>
        <div className="filter-panel__actions">
          <button type="button" className="btn btn-primary" onClick={load}>
            Apply filters
          </button>
        </div>
      </div>

      <div className="appointments-table card card--flat">
        {loading ? (
          <LoadingSpinner label="Loading appointments…" />
        ) : appointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__graphic">
              <Icon name="empty" size={40} />
            </div>
            <p>No appointments match your filters.</p>
            <button type="button" className="btn btn-secondary" onClick={clearFilters}>
              Reset filters
            </button>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Dentist</th>
                  <th>Treatment</th>
                  <th>Date & time</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th className="data-table__actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id}>
                    <td data-label="Patient">
                      <div className="cell-primary">{a.patient_name}</div>
                      <div className="cell-secondary">{a.patient_email}</div>
                    </td>
                    <td data-label="Dentist">{a.dentist_name}</td>
                    <td data-label="Treatment">{a.treatment_name}</td>
                    <td data-label="Date">{formatDateTime(a.datetime_start)}</td>
                    <td data-label="Room">
                      <span className="room-badge">Room {a.room_number}</span>
                    </td>
                    <td data-label="Status">
                      <StatusBadge status={a.status} />
                    </td>
                    <td data-label="Actions" className="data-table__actions-col">
                      <div className="action-group">
                        {a.status === 'scheduled' && (
                          <>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => updateStatus(a.id, 'completed')}
                            >
                              Complete
                            </button>
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm"
                              onClick={() => updateStatus(a.id, 'cancelled')}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => remove(a.id)}
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
    </Layout>
  );
}
