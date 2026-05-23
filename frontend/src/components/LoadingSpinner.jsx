export default function LoadingSpinner({ label = 'Loading' }) {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <div className="spinner" />
      {label && <p className="spinner__label">{label}</p>}
    </div>
  );
}
