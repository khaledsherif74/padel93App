import QueryState from '../../components/QueryState.jsx';
import Section from '../../components/Section.jsx';
import { t } from '../../i18n/t.js';
import { toHours } from '../../lib/dates.js';
import { formatEgp } from '../../lib/money.js';
import GoalProgress from './GoalProgress.jsx';
import LedgerRow from './LedgerRow.jsx';

export default function DaySummaryCard({ summary, shift, permissions }) {
  return (
    <Section title={t('summary.title')}>
      <QueryState query={summary}>
        {(s) => (
          <>
            <dl className="ledger">
              <LedgerRow label={t('summary.hours')} value={t('unit.hours', { n: toHours(s.bookedMinutes) })} />
              <LedgerRow label={t('summary.revenue')} value={s.totals.collected == null ? '—' : formatEgp(s.totals.collected)} strong />
              {s.courts.map((c) => <LedgerRow key={c.courtId} label={c.courtName} value={formatEgp(c.expected)} />)}
              <LedgerRow label={t('summary.shop')} value={formatEgp(s.totals.shop)} />
              <LedgerRow label={t('summary.onAccount')} value={formatEgp(s.onAccount.open)} />
              {shift.status === 'CLOSED' && shift.variance < 0 && <LedgerRow label={t('summary.shortage')} value={formatEgp(-shift.variance)} />}
            </dl>
            {shift.closeNote && <p className="note">{t('summary.note', { note: shift.closeNote })}</p>}
          </>
        )}
      </QueryState>
      <GoalProgress month={shift.businessDate.slice(0, 7)} permissions={permissions} />
    </Section>
  );
}
