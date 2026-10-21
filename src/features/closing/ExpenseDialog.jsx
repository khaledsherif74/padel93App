import { useState } from 'react';
import FormDialog from '../../components/FormDialog.jsx';
import { AmountInput, Field } from '../../components/Field.jsx';
import QueryState from '../../components/QueryState.jsx';
import { t } from '../../i18n/t.js';
import { parseEgp } from '../../lib/money.js';
import { useAction } from '../../lib/useAction.js';
import { useRequestId } from '../../lib/useRequestId.js';
import { useCreateExpenseMutation, useGetExpenseCategoriesQuery } from './closingApi.js';

const ADVANCE_CATEGORY = 'Staff advance'; // advances have their own button; keep them out of this list

export default function ExpenseDialog({ onClose }) {
  const categories = useGetExpenseCategoriesQuery();
  const [create] = useCreateExpenseMutation();
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const action = useAction();
  const piasters = parseEgp(amount);
  const clientRequestId = useRequestId(`${categoryId}|${amount}|${description}`);

  return (
    <FormDialog
      title={t('expense.title')}
      submitLabel={t('expense.save')}
      busy={action.busy}
      error={action.error}
      disabled={!categoryId || piasters == null || piasters <= 0 || description.trim().length < 3}
      onClose={onClose}
      onSubmit={async () => {
        const ok = await action.run(() => create({ clientRequestId, categoryId, amount: piasters, description: description.trim() }).unwrap());
        if (ok) onClose();
      }}
    >
      <QueryState query={categories}>
        {({ items }) => (
          <Field label={t('expense.category')}>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">{t('expense.pick')}</option>
              {items.filter((c) => c.name !== ADVANCE_CATEGORY).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
        )}
      </QueryState>
      <AmountInput label={t('payment.amount')} value={amount} onChange={setAmount} />
      <Field label={t('expense.description')}>
        <input value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>
    </FormDialog>
  );
}
