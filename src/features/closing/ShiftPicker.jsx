import { t } from '../../i18n/t.js';
import { formatBusinessDate } from '../../lib/dates.js';
import { Field } from '../../components/Field.jsx';

export default function ShiftPicker({ shifts, value, onChange }) {
  if (!shifts.length) return null;
  return (
    <Field label={t('picker.label')}>
      <select value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        {shifts.map((s) => (
          <option key={s.id} value={s.id}>
            {formatBusinessDate(s.businessDate)} · {s.openedBy.name} · {t(`shift.${s.status}`)}
          </option>
        ))}
      </select>
    </Field>
  );
}
