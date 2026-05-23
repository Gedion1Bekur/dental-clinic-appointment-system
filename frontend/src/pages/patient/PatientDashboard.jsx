import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import DashboardHero from '../../components/DashboardHero';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import Icon from '../../components/icons/Icon';
import { appointmentsApi } from '../../services/api';
import { formatDateTime } from '../../utils/format';
import StatusBadge from '../../components/StatusBadge';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentsApi
      .list()
      .then((data) => setAppointments(data.appointments))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = appointments.filter(
    (a) => a.status === 'scheduled' && new Date(a.datetime_start) >= new Date()
  );
  const completed = appointments.filter((a) => a.status === 'completed').length;

  return (
    <Layout>
      <DashboardHero
        title="Your care timeline"
        subtitle="Upcoming visits, history, and booking — organized in one view."
      >
        <Link to="/book" className="btn btn-primary">
          <Icon name="plus" size={18} />
          Book visit
        </Link>
        <Link to="/my-appointments" className="btn btn-secondary">
          All appointments
        </Link>
      </DashboardHero>

      <div className="grid-4 section-gap">
        <StatCard variant="calendar" label="Upcoming" value={upcoming.length} hint="Scheduled" accent="blue" delay={50} />
        <StatCard variant="check" label="Completed" value={completed} hint="Finished" accent="green" delay={100} />
        <StatCard variant="list" label="Total" value={appointments.length} hint="All records" delay={150} />
        <StatCard variant="rooms" label="Rooms" value="3" hint="Parallel capacity" accent="amber" delay={200} />
      </div>

      <div className="card card--flat">
        <h2 className="card-title">Upcoming visits</h2>
        {loading ? (
          <LoadingSpinner label="Loading schedule…" />
        ) : upcoming.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__graphic">
              <Icon name="calendar" size={40} />
            </div>
            <p>No visits scheduled yet.</p>
            <Link to="/book" className="btn btn-primary">
              Schedule your first visit
            </Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Treatment</th>
                  <th>Dentist</th>
                  <th>When</th>
                  <th>Room</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.slice(0, 5).map((a) => (
                  <tr key={a.id}>
                    <td data-label="Treatment">{a.treatment_name}</td>
                    <td data-label="Dentist">{a.dentist_name}</td>
                    <td data-label="When">{formatDateTime(a.datetime_start)}</td>
                    <td data-label="Room">
                      <span className="room-badge">Room {a.room_number}</span>
                    </td>
                    <td data-label="Status">
                      <StatusBadge status={a.status} />
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
