import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetCurrentShiftQuery, useListShiftsQuery } from './closingApi.js';

/**
 * Which shift does the page show?
 * STAFF: their open shift, or (after closing) today's closed one, read-only.
 * OWNER / ACCOUNTANT: recent shifts to pick from (accountants without `shifts.list` only get the open ones).
 */
export function useShiftTarget() {
  const { user, permissions } = useSelector((s) => s.auth);
  const isStaff = user.role === 'STAFF';
  const canList = user.role === 'OWNER' || Boolean(permissions['shifts.list']);
  const current = useGetCurrentShiftQuery();
  const list = useListShiftsQuery(undefined, { skip: isStaff || !canList });
  const [pickedId, pick] = useState(null);

  const shifts = isStaff
    ? [...(current.data?.items ?? []), ...(current.data?.lastClosed ? [current.data.lastClosed] : [])]
    : canList ? list.data?.items ?? [] : current.data?.items ?? [];
  const query = isStaff || !canList ? current : list;

  return {
    isStaff,
    query,
    shifts,
    shift: shifts.find((s) => s.id === pickedId) ?? shifts[0] ?? null,
    pick,
  };
}
