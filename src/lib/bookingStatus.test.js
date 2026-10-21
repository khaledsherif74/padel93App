import test from 'node:test';
import assert from 'node:assert/strict';
import { bookingStatus, canPutOnAccount, canRecordPayment, canSellShop, shopTotal, paidByMethod, unresolvedOf } from './bookingStatus.js';

const booking = (payment = {}, over = {}) => ({
  id: 'a1', court: { id: 13, name: 'Court 1' }, startsAt: '2026-09-21T15:00:00Z', removedFromBookly: false, incomes: [],
  payment: { state: 'UNPAID', expected: 45000, collected: 0, due: 45000, flags: [], needsAttention: false, onAccountOpen: 0, ...payment }, ...over,
});

test('status: FREE is derived from expected 0; other states come from the server', () => {
  assert.equal(bookingStatus(booking({ state: 'PAID', expected: 0, due: 0 })), 'FREE');
  assert.equal(bookingStatus(booking({ state: 'PARTIAL' })), 'PARTIAL');
  assert.equal(bookingStatus(booking({ state: 'ON_ACCOUNT' })), 'ON_ACCOUNT');
  assert.equal(bookingStatus(booking({ state: 'CANCELLED', expected: 0 })), 'CANCELLED');
  assert.equal(bookingStatus(booking({ state: 'PRICE_MISSING', expected: null, due: null })), 'PRICE_MISSING');
  assert.equal(bookingStatus(booking({}, { removedFromBookly: true })), 'REMOVED');
});

test('paidByMethod groups booking payments only; shopTotal counts shop sales only', () => {
  const a = booking({}, { incomes: [
    { source: 'APPOINTMENT', method: 'CASH', amount: 10000 }, { source: 'APPOINTMENT', method: 'CASH', amount: 5000 },
    { source: 'APPOINTMENT', method: 'VISA', amount: 3000 }, { source: 'SHOP', method: 'CASH', amount: 700 },
  ] });
  assert.deepEqual(paidByMethod(a), [{ method: 'CASH', amount: 15000 }, { method: 'VISA', amount: 3000 }]);
  assert.equal(shopTotal(a), 700);
});

test('actions: payment needs money due; on account needs an uncovered remainder; shop needs a live booking', () => {
  assert.ok(canRecordPayment(booking()));
  assert.ok(!canRecordPayment(booking({ state: 'PAID', due: 0 })));
  assert.ok(!canRecordPayment(booking({ state: 'CANCELLED', due: null })));
  assert.ok(canPutOnAccount(booking()));
  assert.ok(!canPutOnAccount(booking({ state: 'ON_ACCOUNT', onAccountOpen: 45000 })));
  assert.ok(canSellShop(booking({ state: 'PAID', due: 0 })));
  assert.ok(!canSellShop(booking({ state: 'WAITLISTED' })));
});

test('unresolvedOf keeps only UNRESOLVED_PAST bookings', () => {
  const list = [booking({ flags: ['UNRESOLVED_PAST'] }), booking({}, { id: 'a2' })];
  assert.deepEqual(unresolvedOf(list), [{ id: 'a1', court: 'Court 1', startsAt: '2026-09-21T15:00:00Z', due: 45000 }]);
});
