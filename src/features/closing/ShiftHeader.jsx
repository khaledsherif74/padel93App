import { useState } from 'react';
import { useSelector } from 'react-redux';
import Badge from '../../components/Badge.jsx';
import Button from '../../components/Button.jsx';
import Section from '../../components/Section.jsx';
import { t } from '../../i18n/t.js';
import { formatBusinessDate, formatStamp, formatTime } from '../../lib/dates.js';
import ReopenDialog from './ReopenDialog.jsx';

export default function ShiftHeader({ shift, settings }) {
  const role = useSelector((s) => s.auth.user.role);
  const [reopening, setReopening] = useState(false);
  const closed = shift.status === 'CLOSED';

  return (
    <Section title={t('header.title')} action={<Badge tone={closed ? 'neutral' : 'info'}>{t(`shift.${shift.status}`)}</Badge>}>
      <dl className="facts">
        <div><dt>{t('header.date')}</dt><dd>{formatBusinessDate(shift.businessDate)}</dd></div>
        <div><dt>{t('header.staff')}</dt><dd>{shift.openedBy.name}</dd></div>
        <div><dt>{t('header.openedAt')}</dt><dd>{formatTime(shift.openedAt)}</dd></div>
        {settings && <div><dt>{t('header.hours')}</dt><dd>{settings.openTime}–{settings.closeTime}</dd></div>}
      </dl>
      {closed && (
        <p className="closed-line">
          {t('header.closedAt', { time: formatStamp(shift.closedAt) })}{' '}
          <Badge tone={shift.closedLate ? 'danger' : 'ok'}>{shift.closedLate ? t('header.late') : t('header.onTime')}</Badge>
        </p>
      )}
      {closed && role === 'OWNER' && <Button onClick={() => setReopening(true)}>{t('header.reopen')}</Button>}
      {reopening && <ReopenDialog shiftId={shift.id} onClose={() => setReopening(false)} />}
    </Section>
  );
}
