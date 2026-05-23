import Icon from './icons/Icon';

const iconMap = {
  calendar: 'calendar',
  check: 'check',
  list: 'list',
  rooms: 'rooms',
  users: 'users',
  dentist: 'dentist',
  treatment: 'treatment',
  schedule: 'schedule',
};

export default function StatCard({ variant = 'list', label, value, hint, accent, delay = 0 }) {
  const iconName = iconMap[variant] || 'list';

  return (
    <div
      className={`stat-card ${accent ? `stat-card--${accent}` : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="stat-card__icon">
        <Icon name={iconName} size={22} />
      </div>
      <div className="stat-card__body">
        <p className="stat-card__label">{label}</p>
        <h3 className="stat-card__value">{value}</h3>
        {hint && <p className="stat-card__hint">{hint}</p>}
      </div>
    </div>
  );
}
