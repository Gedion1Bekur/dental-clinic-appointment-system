export default function PageHeader({ title, subtitle, badge, children }) {
  return (
    <header className="page-header">
      <div className="page-header__main">
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {(badge || children) && (
        <div className="page-header__aside">
          {badge && <span className="page-header__badge">{badge}</span>}
          {children}
        </div>
      )}
    </header>
  );
}
