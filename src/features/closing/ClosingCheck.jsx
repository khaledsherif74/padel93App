import Banner from '../../components/Banner.jsx';
import Section from '../../components/Section.jsx';
import { t } from '../../i18n/t.js';
import { formatStamp } from '../../lib/dates.js';
import { formatEgp } from '../../lib/money.js';

function varianceBanner(variance) {
  if (variance === 0) return <Banner tone="ok">{t('cash.balanced')}</Banner>;
  if (variance < 0) return <Banner tone="danger">{t('cash.shortage', { amount: formatEgp(-variance) })}</Banner>;
  return <Banner tone="warn">{t('cash.overage', { amount: formatEgp(variance) })}</Banner>;
}

/** Cash is counted by the system (see Day balance). This shows what is left to check: unsettled bookings and, once closed, the result. */
export default function ClosingCheck({ shift, unresolved }) {
  const closed = shift.status === 'CLOSED';
  if (!closed && !unresolved.length) return null;

  return (
    <Section title={t('check.title')}>
      {closed && (
        <>
          <p className="total"><span>{t('cash.counted')}</span><strong>{formatEgp(shift.countedCash)}</strong></p>
          {shift.countedCash !== shift.expectedCash && (
            <p className="total"><span>{t('balance.expectedCash')}</span><strong>{formatEgp(shift.expectedCash)}</strong></p>
          )}
          {varianceBanner(shift.variance)}
        </>
      )}
      {unresolved.length > 0 && (
        <div className="stack">
          <h4>{t('cash.unresolved', { n: unresolved.length })}</h4>
          <ul className="lines">
            {unresolved.map((u) => <li key={u.id}><span>{u.court} · {formatStamp(u.startsAt)}</span><strong>{formatEgp(u.due)}</strong></li>)}
          </ul>
        </div>
      )}
    </Section>
  );
}
