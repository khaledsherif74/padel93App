import { useState } from 'react';
import Button from '../../components/Button.jsx';
import QueryState from '../../components/QueryState.jsx';
import Section from '../../components/Section.jsx';
import { t } from '../../i18n/t.js';
import { formatStamp } from '../../lib/dates.js';
import { formatEgp, toEgpInput } from '../../lib/money.js';
import { useListOpenOnAccountQuery, useSettleOnAccountMutation } from './closingApi.js';
import PaymentDialog from './PaymentDialog.jsx';

/** Every note (on account) that is still owed, from any day. The customer may pay it off here. */
export default function OnAccountSection({ canEdit, permissions }) {
  const query = useListOpenOnAccountQuery();
  const [settle] = useSettleOnAccountMutation();
  const [paying, setPaying] = useState(null);
  const mayPay = canEdit && permissions['income.create'];

  return (
    <Section title={t('notes.title')}>
      <QueryState query={query} isEmpty={(d) => !d.items.length} emptyText={t('notes.empty')}>
        {({ items }) => (
          <ul className="lines">
            {items.map((n) => (
              <li key={n.id}>
                <span>{n.customerName} · {formatStamp(n.recordedAt)}{n.appointment?.court ? ` · ${n.appointment.court}` : ''}</span>
                <strong>{formatEgp(n.open)}</strong>
                {mayPay && <Button onClick={() => setPaying(n)}>{t('notes.pay')}</Button>}
              </li>
            ))}
          </ul>
        )}
      </QueryState>
      {paying && (
        <PaymentDialog title={t('notes.payTitle', { name: paying.customerName })} allowCard={Boolean(permissions['income.createCard'])}
          maxAmount={paying.open} defaultAmount={toEgpInput(paying.open)}
          onSubmit={(v) => settle({ id: paying.id, clientRequestId: v.clientRequestId, method: v.method, amount: v.amount, receiptId: v.receiptId }).unwrap()}
          onClose={() => setPaying(null)} />
      )}
    </Section>
  );
}
