import QueryState from '../../components/QueryState.jsx';
import Banner from '../../components/Banner.jsx';
import Section from '../../components/Section.jsx';
import { t } from '../../i18n/t.js';
import { toHours } from '../../lib/dates.js';
import { formatEgp } from '../../lib/money.js';
import LedgerRow from './LedgerRow.jsx';

const egp = (v) => (v == null ? '—' : formatEgp(v));

/** Section 4. Every number comes from the closing summary; nothing is calculated here. */
export default function DayBalance({ summary }) {
  return (
    <Section title={t('balance.title')}>
      <QueryState query={summary}>
        {(s) => (
          <div className="balance">
            <dl className="ledger">
              {s.courts.map((c) => <LedgerRow key={c.courtId} label={t('balance.court', { name: c.courtName, n: c.bookings })} value={formatEgp(c.expected)} />)}
              <LedgerRow label={t('balance.courts')} value={formatEgp(s.totals.courtsExpected)} strong />
              <LedgerRow label={t('balance.shopInBookings')} value={formatEgp(s.shop.inBookings)} />
              <LedgerRow label={t('balance.shopOutside')} value={formatEgp(s.shop.outside)} />
              <LedgerRow label={t('balance.totalDay')} value={formatEgp(s.totals.totalDay)} strong />
            </dl>
            <dl className="ledger">
              <LedgerRow label={t('method.CASH')} value={egp(s.byMethod.CASH)} />
              <LedgerRow label={t('method.VISA')} value={egp(s.byMethod.VISA)} />
              <LedgerRow label={t('method.INSTAPAY')} value={egp(s.byMethod.INSTAPAY)} />
              <LedgerRow label={t('balance.expenses')} value={formatEgp(s.expenses.needs + s.expenses.supplies)} />
              <LedgerRow label={t('balance.supplies')} value={formatEgp(s.expenses.supplies)} />
              <LedgerRow label={t('balance.advances')} value={formatEgp(s.expenses.advances)} />
              <LedgerRow label={t('balance.vouchers')} value={t('balance.vouchersValue', { n: s.vouchers.count, h: toHours(s.vouchers.minutes) })} />
              <LedgerRow label={t('balance.onAccount')} value={formatEgp(s.onAccount.recorded)} />
            </dl>
            {s.cash
              ? <p className="total total-big"><span>{t('balance.expectedCash')}</span><strong>{formatEgp(s.cash.expectedCash)}</strong></p>
              : <Banner>{t('balance.blind')}</Banner>}
          </div>
        )}
      </QueryState>
    </Section>
  );
}
