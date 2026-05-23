export default function LiveBackground({ variant = 'default' }) {
  return (
    <div className={`live-bg live-bg--${variant}`} aria-hidden>
      <div className="live-bg__orb live-bg__orb--1" />
      <div className="live-bg__orb live-bg__orb--2" />
      <div className="live-bg__orb live-bg__orb--3" />
      <div className="live-bg__grid" />
    </div>
  );
}
