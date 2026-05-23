const paths = {
  logo: (
    <path
      fill="currentColor"
      d="M12 2C8.5 2 6 4.2 6 7.5c0 2.2 1.1 4.1 2.8 5.2L8 22h8l-.8-9.3C16.9 11.6 18 9.7 18 7.5 18 4.2 15.5 2 12 2zm0 2c2.2 0 4 1.6 4 3.5S14.2 11 12 11 8 9.4 8 7.5 9.8 4 12 4z"
    />
  ),
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  list: (
    <>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="7" r="3" />
      <path d="M2 20c0-3.5 3-6 7-6" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M14 20c0-2.5 2-4.5 5-4.5" />
    </>
  ),
  dentist: (
    <>
      <path d="M12 2v4M8 4h8" />
      <circle cx="12" cy="11" r="5" />
      <path d="M7 20c.5-3 2.2-5 5-5s4.5 2 5 5" />
    </>
  ),
  treatment: (
    <>
      <path d="M12 3c-2 0-3.5 1.5-3.5 3.5 0 1.2.6 2.2 1.5 2.8L12 21l1.5-11.7c.9-.6 1.5-1.6 1.5-2.8C15 4.5 13.5 3 12 3z" />
    </>
  ),
  schedule: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  logout: <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  moon: <path d="M20 14.5A8.5 8.5 0 1111.5 3 7 7 0 0020 14.5z" />,
  check: <path d="M20 6L9 17l-5-5" />,
  rooms: (
    <>
      <path d="M3 21h18M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-6h6v6" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  empty: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 10h18M8 2v4M16 2v4" />
    </>
  ),
};

export default function Icon({ name, size = 20, className = '', filled = false }) {
  const content = paths[name];
  if (!content) return null;

  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={filled ? 0 : 1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {content}
    </svg>
  );
}
