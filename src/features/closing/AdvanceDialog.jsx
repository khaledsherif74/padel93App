import { useState } from 'react';
import FormDialog from '../../components/FormDialog.jsx';
import { AmountInput, Field } from '../../components/Field.jsx';
import { t } from '../../i18n/t.js';
import { parseEgp } from '../../lib/money.js';
import { useAction } from '../../lib/useAction.js';
import { useRequestId } from '../../lib/useRequestId.js';
import { useCreateAdvanceMutation } from './closingApi.js';

/** Salaf: cash given to a staff member out of the drawer. */
export default function AdvanceDialog({ onClose }) {
  const [create] = useCreateAdvanceMutation();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const action = useAction();
  const piasters = parseEgp(amount);
  const clientRequestId = useRequestId(`${name}|${amount}`);

  return (
    <FormDialog
      title={t('advance.title')}
      submitLabel={t('advance.save')}
      busy={action.busy}
      error={action.error}
      disabled={name.trim().length < 2 || piasters == null || piasters <= 0}
      onClose={onClose}
      onSubmit={async () => {
        const ok = await action.run(() => create({ clientRequestId, recipientName: name.trim(), amount: piasters }).unwrap());
        if (ok) onClose();
      }}
    >
      <Field label={t('advance.who')}>
        <input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      </Field>
      <AmountInput label={t('payment.amount')} value={amount} onChange={setAmount} />
    </FormDialog>
  );
}
