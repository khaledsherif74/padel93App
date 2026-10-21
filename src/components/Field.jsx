/** Label wrapped around the control, so the control is always labelled and the whole label is tappable. */
export function Field({ label, hint, children }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

export function AmountInput({ label, value, onChange, hint, autoFocus }) {
  return (
    <Field label={label} hint={hint}>
      <input inputMode="decimal" autoComplete="off" autoFocus={autoFocus} placeholder="0.00" value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}
