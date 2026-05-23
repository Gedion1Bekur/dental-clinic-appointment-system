import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';
import LiveBackground from './LiveBackground';
import AnimatedPage from './AnimatedPage';
import Icon from './icons/Icon';

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const patientLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/book', label: 'Book', icon: 'calendar' },
    { to: '/my-appointments', label: 'Appointments', icon: 'list' },
    { to: '/profile', label: 'Profile', icon: 'user' },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: 'dashboard' },
    { to: '/admin/users', label: 'Users', icon: 'users' },
    { to: '/admin/dentists', label: 'Dentists', icon: 'dentist' },
    { to: '/admin/treatments', label: 'Treatments', icon: 'treatment' },
    { to: '/admin/appointments', label: 'Schedule', icon: 'schedule' },
  ];

  const links = isAdmin ? adminLinks : patientLinks;
  const home = isAdmin ? '/admin' : '/dashboard';
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    document.body.classList.toggle('nav-open', menuOpen);
    return () => document.body.classList.remove('nav-open');
  }, [menuOpen]);

  return (
    <div className="app-shell">
      <LiveBackground />
      <header className="app-header">
        <div className="app-header__bar">
          <div className="app-header__brand">
            <Link to={home} className="app-logo" onClick={closeMenu}>
              <Logo />
            </Link>
          </div>

          <div className={`app-header__nav-wrap ${menuOpen ? 'app-header__nav-wrap--open' : ''}`}>
            <nav className="app-nav" aria-label="Main navigation">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/dashboard' || l.to === '/admin'}
                  className={({ isActive }) =>
                    `app-nav__link${isActive ? ' app-nav__link--active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  <Icon name={l.icon} size={18} />
                  <span>{l.label}</span>
                </NavLink>
              ))}
            </nav>
            <div className="app-nav-mobile-footer">
              <div className="user-menu user-menu--mobile">
                <div className="user-menu__avatar">{getInitials(user?.name)}</div>
                <div className="user-menu__info">
                  <span className="user-menu__name">{user?.name}</span>
                  <span className={`role-pill role-pill--${user?.role}`}>{user?.role}</span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-block"
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
              >
                <Icon name="logout" size={18} />
                Sign out
              </button>
            </div>
          </div>

          <div className="app-header__actions">
            <ThemeToggle className="app-header__theme" />
            <div className="user-menu hide-mobile">
              <div className="user-menu__avatar" title={user?.name}>
                {getInitials(user?.name)}
              </div>
              <div className="user-menu__info">
                <span className="user-menu__name">{user?.name}</span>
                <span className={`role-pill role-pill--${user?.role}`}>{user?.role}</span>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm hide-mobile"
              onClick={handleLogout}
            >
              Sign out
            </button>
            <button
              type="button"
              className="app-header__menu-btn"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span className={`hamburger ${menuOpen ? 'hamburger--open' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <button
          type="button"
          className="app-header__backdrop"
          onClick={closeMenu}
          aria-label="Close menu"
        />
      )}

      <main className="container main-content">
        <AnimatedPage stagger>{children}</AnimatedPage>
      </main>
    </div>
  );
}
