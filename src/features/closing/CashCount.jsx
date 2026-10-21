import Banner from '../../components/Banner.jsx';
import { AmountInput } from '../../components/Field.jsx';
import Section from '../../components/Section.jsx';
import { t } from '../../i18n/t.js';
import { formatStamp } from '../../lib/dates.js';
import { formatEgp, parseEgp } from '../../lib/money.js';

function varianceBanner(variance) {
  if (variance === 0) return <Banner tone="ok">{t('cash.balanced')}</Banner>;
  if (variance < 0) return <Banner tone="danger">{t('cash.shortage', { amount: formatEgp(-variance) })}</Banner>;
  return <Banner tone="warn">{t('cash.overage', { amount: formatEgp(variance) })}</Banner>;
}

/** Section 5. Open + editable: count, live variance (when the owner allows it). Closed: the saved result. */
export default function CashCount({ summary, shift, counted, onCounted, canEdit, unresolved }) {
  const closed = shift.status === 'CLOSED';
  const expected = summary.data?.cash?.expectedCash; // missing in blind mode
  const countedP = parseEgp(counted);
  const live = expected != null && countedP != null ? countedP - expected : null;

  return (
    <Section title={t('cash.title')}>
      {closed && (
        <>
          <p className="total"><span>{t('cash.counted')}</span><strong>{formatEgp(shift.countedCash)}</strong></p>
          <p className="total"><span>{t('balance.expectedCash')}</span><strong>{formatEgp(shift.expectedCash)}</strong></p>
          {varianceBanner(shift.variance)}
        </>
      )}
      {!closed && canEdit && (
        <>
          <AmountInput label={t('cash.count')} value={counted} onChange={onCounted} hint={expected == null ? t('cash.blindHint') : undefined} />
          {live != null && (live > 0 ? <Banner tone="danger">{t('cash.recount')}</Banner> : varianceBanner(live))}
        </>
      )}
      {!closed && !canEdit && <p className="muted">{t('cash.notYet')}</p>}
      {unresolved.length > 0 && (
        <div className="stack">
          <h3>{t('cash.unresolved', { n: unresolved.length })}</h3>
          <ul className="lines">
            {unresolved.map((u) => <li key={u.id}><span>{u.court} · {formatStamp(u.startsAt)}</span><strong>{formatEgp(u.due)}</strong></li>)}
          </ul>
        </div>
      )}
    </Section>
  );
}
