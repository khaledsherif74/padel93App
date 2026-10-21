// Pure helpers over one item of GET /appointments. No money maths here: the server already did it.
const DEAD = ['CANCELLED', 'WAITLISTED', 'REMOVED'];

/** One status for the badge. FREE is derived from the booking (expected 0); everything else is payment.state. */
export function bookingStatus(a) {
  const { state, expected } = a.payment;
  if (a.removedFromBookly) return 'REMOVED';
  if (DEAD.includes(state) || state === 'PRICE_MISSING') return state;
  return expected === 0 ? 'FREE' : state;
}

const sumBy = (rows, pick) => rows.reduce((t, r) => t + pick(r), 0);

/** Payments for the booking itself, grouped by method: [{ method, amount }]. */
export function paidByMethod(a) {
  const totals = new Map();
  for (const i of a.incomes.filter((x) => x.source === 'APPOINTMENT')) {
    totals.set(i.method, (totals.get(i.method) ?? 0) + i.amount);
  }
  return [...totals].map(([method, amount]) => ({ method, amount }));
}

export const shopTotal = (a) => sumBy(a.incomes.filter((i) => i.source === 'SHOP'), (i) => i.amount);

const live = (a) => !DEAD.includes(a.payment.state) && !a.removedFromBookly;
export const canRecordPayment = (a) => live(a) && a.payment.due > 0;
export const canPutOnAccount = (a) => live(a) && a.payment.due > a.payment.onAccountOpen;
export const canSellShop = (a) => live(a);

/** Past bookings that still owe money and are not explained (the server flags them UNRESOLVED_PAST). */
export const unresolvedOf = (appointments) =>
  appointments
    .filter((a) => a.payment.flags.includes('UNRESOLVED_PAST'))
    .map((a) => ({ id: a.id, court: a.court.name, startsAt: a.startsAt, due: a.payment.due }));
