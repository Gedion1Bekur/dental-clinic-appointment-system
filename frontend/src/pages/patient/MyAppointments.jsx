import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import Icon from '../../components/icons/Icon';
import { appointmentsApi } from '../../services/api';
import { formatDateTime } from '../../utils/format';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    appointmentsApi
      .list()
      .then((data) => setAppointments(data.appointments))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    try {
      await appointmentsApi.update(id, { status: 'cancelled' });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Layout>
      <PageHeader
        title="My appointments"
        subtitle="View and manage your scheduled visits"
        badge={`${appointments.length} records`}
      >
        <Link to="/book" className="btn btn-primary btn-sm">
          Book new
        </Link>
      </PageHeader>

      {error && <p className="error-msg page-alert">{error}</p>}

      <div className="card card--flat data-panel">
        {loading ? (
          <LoadingSpinner label="Loading appointments…" />
        ) : appointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__graphic">
              <Icon name="list" size={40} />
            </div>
            <p>No appointments on file yet.</p>
            <Link to="/book" className="btn btn-primary">
              Book a visit
            </Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Treatment</th>
                  <th>Dentist</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th className="data-table__actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id}>
                    <td data-label="Treatment">{a.treatment_name}</td>
                    <td data-label="Dentist">{a.dentist_name}</td>
                    <td data-label="Start">{formatDateTime(a.datetime_start)}</td>
                    <td data-label="End">{formatDateTime(a.datetime_end)}</td>
                    <td data-label="Room">
                      <span className="room-badge">Room {a.room_number}</span>
                    </td>
                    <td data-label="Status">
                      <StatusBadge status={a.status} />
                    </td>
                    <td data-label="Actions" className="data-table__actions-col">
                      {a.status === 'scheduled' && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => cancel(a.id)}
                        >
                          Cancel
                        </button>
                      )}
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
