import { useState } from 'react';
import Button from '../../components/Button.jsx';
import QueryState from '../../components/QueryState.jsx';
import Section from '../../components/Section.jsx';
import { t } from '../../i18n/t.js';
import { canPutOnAccount, canRecordPayment, canSellShop, shopTotal, paidByMethod } from '../../lib/bookingStatus.js';
import { formatTimeRange } from '../../lib/dates.js';
import { formatEgp, toEgpInput } from '../../lib/money.js';
import { useCreateIncomeMutation } from './closingApi.js';
import OnAccountDialog from './OnAccountDialog.jsx';
import PaymentBadge from './PaymentBadge.jsx';
import PaymentDialog from './PaymentDialog.jsx';

const dash = '—';

function Row({ booking: b, canEdit, permissions, onAction }) {
  const { payment } = b;
  const paid = paidByMethod(b);
  const shop = shopTotal(b);
  const mayPay = canEdit && permissions['income.create'];
  return (
    <tr className={payment.needsAttention ? 'needs-attention' : undefined}>
      <td data-label={t('bookings.time')}>
        <strong>{formatTimeRange(b.startsAt, b.endsAt)}</strong>
        <div className="muted">{b.court.name}</div>
      </td>
      <td data-label={t('bookings.customer')}>{b.customer.name ?? dash}</td>
      <td data-label={t('bookings.duration')}>{t('unit.minutes', { n: b.durationMinutes })}</td>
      <td data-label={t('bookings.expected')}>
        {payment.expected == null ? t('bookings.noPrice') : formatEgp(payment.expected)}
        {b.bookly.paymentStatus && (
          <div className="muted">{t('bookings.bookly', { status: b.bookly.paymentStatus, paid: b.bookly.paid == null ? dash : formatEgp(b.bookly.paid) })}</div>
        )}
      </td>
      <td data-label={t('bookings.paidBy')}>
        {paid.length ? paid.map((p) => <div key={p.method}>{t(`method.${p.method}`)} {formatEgp(p.amount)}</div>) : dash}
      </td>
      <td data-label={t('bookings.onAccount')}>{payment.onAccountOpen > 0 ? formatEgp(payment.onAccountOpen) : dash}</td>
      <td data-label={t('bookings.shop')}>{shop > 0 ? formatEgp(shop) : dash}</td>
      <td data-label={t('bookings.status')}>
        <PaymentBadge booking={b} />
        {payment.due > 0 && <div className="muted">{t('bookings.due', { amount: formatEgp(payment.due) })}</div>}
      </td>
      <td className="row-actions">
        {mayPay && canRecordPayment(b) && <Button onClick={() => onAction('pay', b)}>{t('bookings.pay')}</Button>}
        {mayPay && canPutOnAccount(b) && <Button onClick={() => onAction('account', b)}>{t('bookings.putOnAccount')}</Button>}
        {mayPay && canSellShop(b) && <Button onClick={() => onAction('shop', b)}>{t('bookings.shop.add')}</Button>}
      </td>
    </tr>
  );
}

export default function BookingsTable({ query, canEdit, permissions }) {
  const [createIncome] = useCreateIncomeMutation();
  const [dialog, setDialog] = useState(null); // { type: 'pay' | 'account' | 'shop', booking }
  const close = () => setDialog(null);
  const allowCard = Boolean(permissions['income.createCard']);

  return (
    <Section title={t('bookings.title')}>
      <QueryState query={query} isEmpty={(d) => !d.items.length} emptyText={t('bookings.empty')}>
        {(data) => (
          <div className="table-wrap">
            <table className="bookings">
              <thead>
                <tr>
                  {['time', 'customer', 'duration', 'expected', 'paidBy', 'onAccount', 'shop', 'status'].map((k) => <th key={k} scope="col">{t(`bookings.${k}`)}</th>)}
                  <th scope="col"><span className="sr-only">{t('bookings.actions')}</span></th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((b) => <Row key={b.id} booking={b} canEdit={canEdit} permissions={permissions} onAction={(type, booking) => setDialog({ type, booking })} />)}
              </tbody>
            </table>
          </div>
        )}
      </QueryState>
      {dialog?.type === 'pay' && (
        <PaymentDialog title={t('payment.titleBooking', { court: dialog.booking.court.name })} allowCard={allowCard} maxAmount={dialog.booking.payment.due}
          defaultAmount={toEgpInput(dialog.booking.payment.due)} shortNoteRequired noteLabel={t('payment.shortReason')}
          onSubmit={(v) => createIncome({ source: 'APPOINTMENT', appointmentId: dialog.booking.id, ...v }).unwrap()} onClose={close} />
      )}
      {dialog?.type === 'shop' && (
        <PaymentDialog title={t('shop.titleBooking', { court: dialog.booking.court.name })} allowCard={allowCard} noteRequired noteLabel={t('shop.note')}
          onSubmit={(v) => createIncome({ source: 'SHOP', appointmentId: dialog.booking.id, ...v }).unwrap()} onClose={close} />
      )}
      {dialog?.type === 'account' && <OnAccountDialog booking={dialog.booking} onClose={close} />}
    </Section>
  );
}
