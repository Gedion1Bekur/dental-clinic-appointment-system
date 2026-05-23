import { useAuth } from '../context/AuthContext';

export default function DashboardHero({ title, subtitle, children }) {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <section className="dashboard-hero">
      <div className="dashboard-hero__mesh" aria-hidden />
      <div className="dashboard-hero__content">
        <p className="dashboard-hero__greeting">
          <span className="pulse-dot" aria-hidden />
          Welcome back, {firstName}
        </p>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
        {children && <div className="dashboard-hero__actions">{children}</div>}
      </div>
    </section>
  );
}
