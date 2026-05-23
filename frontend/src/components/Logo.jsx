import Icon from './icons/Icon';

export default function Logo({ compact = false }) {
  return (
    <span className={`logo-mark ${compact ? 'logo-mark--compact' : ''}`}>
      <span className="logo-mark__icon">
        <Icon name="logo" size={compact ? 20 : 22} filled />
      </span>
      {!compact && (
        <span className="logo-mark__text">
          <span className="logo-mark__name">SmileCare</span>
          <span className="logo-mark__tag">Appointment Studio</span>
        </span>
      )}
    </span>
  );
}
