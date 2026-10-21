import { useState } from 'react';
import FormDialog from '../../components/FormDialog.jsx';
import { Field } from '../../components/Field.jsx';
import { t } from '../../i18n/t.js';
import { useAction } from '../../lib/useAction.js';
import { useReopenShiftMutation } from './closingApi.js';

export default function ReopenDialog({ shiftId, onClose }) {
  const [reopen] = useReopenShiftMutation();
  const [reason, setReason] = useState('');
  const action = useAction();
  return (
    <FormDialog
      title={t('reopen.title')}
      submitLabel={t('reopen.submit')}
      busy={action.busy}
      error={action.error}
      disabled={reason.trim().length < 3}
      onClose={onClose}
      onSubmit={async () => { if (await action.run(() => reopen({ id: shiftId, reason: reason.trim() }).unwrap())) onClose(); }}
    >
      <p>{t('reopen.body')}</p>
      <Field label={t('reopen.reason')}>
        <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
      </Field>
    </FormDialog>
  );
}
