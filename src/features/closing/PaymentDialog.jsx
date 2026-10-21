import { useState } from 'react';
import FormDialog from '../../components/FormDialog.jsx';
import { AmountInput, Field } from '../../components/Field.jsx';
import { t } from '../../i18n/t.js';
import { formatEgp, parseEgp } from '../../lib/money.js';
import { useAction } from '../../lib/useAction.js';
import { useRequestId } from '../../lib/useRequestId.js';
import { useUploadReceiptMutation } from './closingApi.js';

/**
 * One form for every incoming payment: booking payment, shop sale, paying off an on-account note.
 * Card / transfer need a receipt image, uploaded first (the server returns the same id if the same image is retried).
 * maxAmount: cap in piasters. shortNoteRequired: a note is needed when paying less than maxAmount. noteRequired: always.
 */
export default function PaymentDialog({ title, defaultAmount = '', maxAmount, shortNoteRequired, noteRequired, noteLabel, allowCard, onSubmit, onClose }) {
  const [upload] = useUploadReceiptMutation();
  const [method, setMethod] = useState('CASH');
  const [amount, setAmount] = useState(defaultAmount);
  const [note, setNote] = useState('');
  const [file, setFile] = useState(null);
  const action = useAction();

  const piasters = parseEgp(amount);
  const short = maxAmount != null && piasters != null && piasters < maxAmount;
  const needsNote = noteRequired || (shortNoteRequired && short);
  const showNote = noteRequired || shortNoteRequired;
  const clientRequestId = useRequestId(`${method}|${amount}|${note}|${file?.name}`);
  const invalid =
    piasters == null || piasters <= 0 || (maxAmount != null && piasters > maxAmount) ||
    (method !== 'CASH' && !file) || (needsNote && note.trim().length < 3);

  const submit = async () => {
    const ok = await action.run(async () => {
      const receiptId = method === 'CASH' ? undefined : (await upload(file).unwrap()).id;
      await onSubmit({ clientRequestId, method, amount: piasters, receiptId, note: needsNote || note.trim() ? note.trim() : undefined });
    });
    if (ok) onClose();
  };

  return (
    <FormDialog title={title} submitLabel={t('payment.save')} busy={action.busy} error={action.error} disabled={invalid} onSubmit={submit} onClose={onClose}>
      <fieldset className="choice">
        <legend>{t('payment.method')}</legend>
        {['CASH', ...(allowCard ? ['VISA', 'INSTAPAY'] : [])].map((m) => (
          <label key={m}>
            <input type="radio" name="method" checked={method === m} onChange={() => setMethod(m)} /> {t(`method.${m}`)}
          </label>
        ))}
      </fieldset>
      <AmountInput label={t('payment.amount')} value={amount} onChange={setAmount} autoFocus
        hint={maxAmount != null ? t('payment.max', { amount: formatEgp(maxAmount) }) : undefined} />
      {method !== 'CASH' && (
        <Field label={t('payment.receipt')} hint={t('payment.receiptHint')}>
          <input type="file" accept="image/*" capture="environment" onChange={(e) => setFile(e.target.files[0] ?? null)} />
        </Field>
      )}
      {showNote && (
        <Field label={noteLabel} hint={shortNoteRequired && short ? t('payment.shortHint') : undefined}>
          <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
      )}
    </FormDialog>
  );
}
