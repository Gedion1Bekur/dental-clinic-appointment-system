import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import DashboardHero from '../../components/DashboardHero';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { appointmentsApi, dentistsApi, treatmentsApi, usersApi } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    dentists: 0,
    treatments: 0,
    appointments: 0,
    scheduled: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      usersApi.list(),
      dentistsApi.list(),
      treatmentsApi.list(),
      appointmentsApi.list(),
    ])
      .then(([users, dentists, treatments, appointments]) => {
        const scheduled = appointments.appointments.filter((a) => a.status === 'scheduled').length;
        setStats({
          users: users.users.length,
          dentists: dentists.dentists.length,
          treatments: treatments.treatments.length,
          appointments: appointments.appointments.length,
          scheduled,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <DashboardHero
        title="Operations overview"
        subtitle="Monitor capacity, staff, and bookings across three active treatment rooms."
      >
        <Link to="/admin/appointments" className="btn btn-primary">
          Open schedule
        </Link>
        <Link to="/admin/dentists" className="btn btn-secondary">
          Manage dentists
        </Link>
      </DashboardHero>

      {loading ? (
        <LoadingSpinner label="Loading clinic metrics…" />
      ) : (
        <div className="grid-4 section-gap">
          <StatCard variant="users" label="Users" value={stats.users} hint="Accounts" accent="blue" delay={50} />
          <StatCard variant="dentist" label="Dentists" value={stats.dentists} hint="On staff" accent="green" delay={100} />
          <StatCard variant="treatment" label="Treatments" value={stats.treatments} hint="Catalog" delay={150} />
          <StatCard
            variant="schedule"
            label="Appointments"
            value={stats.appointments}
            hint={`${stats.scheduled} active`}
            accent="amber"
            delay={200}
          />
        </div>
      )}

      <div className="grid-2 section-gap">
        <div className="card card--flat info-panel">
          <h2 className="info-panel__title">Room capacity</h2>
          <p>
            Three treatment rooms run concurrently. The scheduler blocks dentist overlap and
            assigns the first free room automatically.
          </p>
          <div className="room-pills">
            <span className="room-pill">Room 1</span>
            <span className="room-pill">Room 2</span>
            <span className="room-pill">Room 3</span>
          </div>
        </div>
        <div className="card card--flat info-panel">
          <h2 className="info-panel__title">Shortcuts</h2>
          <div className="quick-actions">
            <Link to="/admin/users" className="btn btn-secondary">
              Users
            </Link>
            <Link to="/admin/treatments" className="btn btn-secondary">
              Treatments
            </Link>
            <Link to="/admin/appointments" className="btn btn-primary">
              Schedule
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
