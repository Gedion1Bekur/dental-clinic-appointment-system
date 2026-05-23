import { useTheme } from '../context/ThemeContext';
import Icon from './icons/Icon';

export default function ThemeToggle({ className = '' }) {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      className={`btn btn-ghost theme-toggle ${className}`}
      onClick={toggleTheme}
      title={isDark ? 'Light mode' : 'Dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={!isDark}
    >
      <Icon name={isDark ? 'sun' : 'moon'} size={18} />
      <span className="theme-toggle__label">{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
}
