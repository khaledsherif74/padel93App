import { useState } from 'react';
import FormDialog from '../../components/FormDialog.jsx';
import { AmountInput, Field } from '../../components/Field.jsx';
import { t } from '../../i18n/t.js';
import { formatEgp, parseEgp, toEgpInput } from '../../lib/money.js';
import { useAction } from '../../lib/useAction.js';
import { useRequestId } from '../../lib/useRequestId.js';
import { useCreateOnAccountMutation } from './closingApi.js';

/** Put (the rest of) a booking on account: the customer owes it, nothing is collected today. */
export default function OnAccountDialog({ booking, onClose }) {
  const [create] = useCreateOnAccountMutation();
  const max = booking.payment.due - booking.payment.onAccountOpen;
  const [name, setName] = useState(booking.customer.name ?? '');
  const [amount, setAmount] = useState(toEgpInput(max));
  const action = useAction();
  const piasters = parseEgp(amount);
  const clientRequestId = useRequestId(`${name}|${amount}`);

  return (
    <FormDialog
      title={t('onAccount.title')}
      submitLabel={t('onAccount.save')}
      busy={action.busy}
      error={action.error}
      disabled={name.trim().length < 2 || piasters == null || piasters <= 0 || piasters > max}
      onClose={onClose}
      onSubmit={async () => {
        const ok = await action.run(() => create({ clientRequestId, appointmentId: booking.id, customerName: name.trim(), amount: piasters }).unwrap());
        if (ok) onClose();
      }}
    >
      <Field label={t('onAccount.customer')}>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <AmountInput label={t('payment.amount')} value={amount} onChange={setAmount} autoFocus hint={t('payment.max', { amount: formatEgp(max) })} />
    </FormDialog>
  );
}
