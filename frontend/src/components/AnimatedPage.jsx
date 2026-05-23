export default function AnimatedPage({ children, className = '', stagger = false }) {
  return (
    <div className={`page-enter ${stagger ? 'stagger-children' : ''} ${className}`.trim()}>
      {children}
    </div>
  );
}
