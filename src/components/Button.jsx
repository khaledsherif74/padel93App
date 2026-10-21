export default function Button({ variant = 'secondary', busy = false, disabled, children, ...props }) {
  return (
    <button type="button" {...props} className={`btn btn-${variant}`} disabled={busy || disabled} aria-busy={busy || undefined}>
      {children}
    </button>
  );
}
