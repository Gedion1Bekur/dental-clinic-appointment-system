import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/patient/PatientDashboard';
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';
import Profile from './pages/patient/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManagement from './pages/admin/UsersManagement';
import DentistsManagement from './pages/admin/DentistsManagement';
import TreatmentsManagement from './pages/admin/TreatmentsManagement';
import AppointmentsOverview from './pages/admin/AppointmentsOverview';

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="route-loading">
        <LoadingSpinner label="Loading workspace…" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute roles={['patient']} />}>
        <Route path="/dashboard" element={<PatientDashboard />} />
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UsersManagement />} />
        <Route path="/admin/dentists" element={<DentistsManagement />} />
        <Route path="/admin/treatments" element={<TreatmentsManagement />} />
        <Route path="/admin/appointments" element={<AppointmentsOverview />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
