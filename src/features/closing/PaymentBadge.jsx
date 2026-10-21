import Badge from '../../components/Badge.jsx';
import { t } from '../../i18n/t.js';
import { bookingStatus } from '../../lib/bookingStatus.js';

const TONE = {
  PAID: 'ok', FREE: 'info', ON_ACCOUNT: 'info',
  PARTIAL: 'warn', UNPAID: 'danger', OVERPAID: 'warn', PRICE_MISSING: 'warn',
  CANCELLED: 'neutral', WAITLISTED: 'neutral', REMOVED: 'neutral',
};

export default function PaymentBadge({ booking }) {
  const status = bookingStatus(booking);
  return <Badge tone={TONE[status] ?? 'neutral'}>{status === 'PAID' ? `${t('status.PAID')} ✓` : t(`status.${status}`)}</Badge>;
}
