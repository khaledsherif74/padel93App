import { useState } from 'react';
import Button from '../../components/Button.jsx';
import FormDialog from '../../components/FormDialog.jsx';
import { Field } from '../../components/Field.jsx';
import Section from '../../components/Section.jsx';
import { errorCode } from '../../lib/apiErrors.js';
import { t } from '../../i18n/t.js';
import { formatEgp } from '../../lib/money.js';
import { useAction } from '../../lib/useAction.js';
import { useCloseShiftMutation } from './closingApi.js';

/** Section 7: final confirm, then POST /shifts/:id/close. The server counts the cash. After this the page is read-only for the staff. */
export default function CloseDay({ shift, summary, canEdit, unresolvedCount, onClosed }) {
  const [closeShift] = useCloseShiftMutation();
  const [confirming, setConfirming] = useState(false);
  const [note, setNote] = useState('');
  const action = useAction();
  if (!canEdit) return null;

  const cash = summary?.cash?.expectedCash; // hidden while the owner keeps the expected cash blind

  const confirm = async () => {
    try {
      onClosed(await closeShift({ id: shift.id, note: note.trim() || undefined }).unwrap());
    } catch (err) {
      if (errorCode(err) !== 'SHIFT_CLOSED') throw err; // already closed (e.g. a retry after a lost response): just reload
    }
    setConfirming(false);
  };

  return (
    <Section title={t('close.title')}>
      <Button variant="primary" onClick={() => setConfirming(true)}>{t('close.action')}</Button>
      {confirming && (
        <FormDialog title={t('close.confirmTitle')} submitLabel={t('close.confirm')} busy={action.busy} error={action.error} onClose={() => setConfirming(false)} onSubmit={() => action.run(confirm)}>
          {cash != null && <p>{t('close.cash', { amount: formatEgp(cash) })}</p>}
          {unresolvedCount > 0 && <p>{t('close.unresolved', { n: unresolvedCount })}</p>}
          <p>{t('close.final')}</p>
          <Field label={t('close.note')}>
            <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
        </FormDialog>
      )}
    </Section>
  );
}
