import { useState } from 'react';
import { useSelector } from 'react-redux';
import Banner from '../../components/Banner.jsx';
import Group from '../../components/Group.jsx';
import { t } from '../../i18n/t.js';
import { unresolvedOf } from '../../lib/bookingStatus.js';
import BookingsTable from './BookingsTable.jsx';
import CloseDay from './CloseDay.jsx';
import { useGetAppointmentsQuery, useGetClosingSummaryQuery, useGetSettingsQuery } from './closingApi.js';
import DayBalance from './DayBalance.jsx';
import DaySummaryCard from './DaySummaryCard.jsx';
import ExpensesSection from './ExpensesSection.jsx';
import ShopSection from './ShopSection.jsx';
import OnAccountSection from './OnAccountSection.jsx';
import ShiftHeader from './ShiftHeader.jsx';

export default function ClosingView({ shift }) {
  const { user, permissions } = useSelector((s) => s.auth);
  const settings = useGetSettingsQuery();
  const summary = useGetClosingSummaryQuery(shift.id);
  const appointments = useGetAppointmentsQuery(shift.businessDate);
  const [closeResult, setCloseResult] = useState(null);

  const maintenance = Boolean(settings.data?.maintenanceMode);
  const isStaff = user.role === 'STAFF';
  // Read-only for everyone once closed; only the staff who owns the open shift can edit, and not during maintenance.
  const canEdit = isStaff && shift.status === 'OPEN' && !maintenance;
  const unresolved = closeResult?.unresolved?.length
    ? closeResult.unresolved.map((u) => ({ id: u.appointmentId, court: u.court, startsAt: u.startsAt, due: u.due }))
    : unresolvedOf(appointments.data?.items ?? []);

  return (
    <>
      <ShiftHeader shift={shift} settings={settings.data} />
      {maintenance && isStaff && <Banner tone="warn">{t('closing.maintenance')}</Banner>}
      <Group title={t('group.bookings')}>
        <BookingsTable query={appointments} canEdit={canEdit} permissions={permissions} />
      </Group>
      <div className="group-grid">
        <Group title={t('group.sales')} area="sales">
          <ShopSection summary={summary} canEdit={canEdit} permissions={permissions} />
          <OnAccountSection canEdit={canEdit} permissions={permissions} />
          <ExpensesSection summary={summary} canEdit={canEdit} permissions={permissions} />
        </Group>
        <Group title={t('group.balance')} area="balance">
          <DayBalance summary={summary} />
        </Group>
        <Group title={t('group.close')} area="close">
          <DaySummaryCard summary={summary} shift={shift} permissions={permissions} />
          <CloseDay shift={shift} summary={summary.data} canEdit={canEdit} unresolvedCount={unresolved.length} onClosed={setCloseResult} />
        </Group>
      </div>
    </>
  );
}
