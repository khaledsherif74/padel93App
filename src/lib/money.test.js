import test from 'node:test';
import assert from 'node:assert/strict';
import { formatEgp, parseEgp, toEgpInput } from './money.js';

test('formatEgp: integer piasters -> 2 decimals with thousands separator', () => {
  assert.equal(formatEgp(0), '0.00 EGP');
  assert.equal(formatEgp(45050), '450.50 EGP');
  assert.equal(formatEgp(123456789), '1,234,567.89 EGP');
  assert.equal(formatEgp(-2500), '-25.00 EGP');
});

test('parseEgp: exact piasters, no float error', () => {
  assert.equal(parseEgp('450'), 45000);
  assert.equal(parseEgp('450.5'), 45050);
  assert.equal(parseEgp('0.07'), 7);
  assert.equal(parseEgp('1.10'), 110);
  assert.equal(parseEgp('19.99'), 1999);
  assert.equal(parseEgp(' 12,50 '), 1250);
});

test('parseEgp: rejects empty, negative, too precise, text, huge', () => {
  for (const bad of ['', ' ', '-5', '1.234', 'abc', '1e3', '12345678', '1.', '.5', null, undefined]) assert.equal(parseEgp(bad), null, String(bad));
});

test('toEgpInput round-trips through parseEgp', () => {
  for (const p of [0, 1, 99, 100, 45050, 99999999]) assert.equal(parseEgp(toEgpInput(p)), p);
});
