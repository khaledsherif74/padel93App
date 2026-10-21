// The ONLY place money is formatted or parsed. Money is integer piasters everywhere else.
export const CURRENCY = 'EGP';

export const formatEgp = (piasters) =>
  `${(piasters / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${CURRENCY}`;

/** "12", "12.5", "12,50" -> piasters. Anything else (empty, negative, 3 decimals, text) -> null. No floats involved. */
export function parseEgp(text) {
  const m = /^(\d{1,7})(?:\.(\d{1,2}))?$/.exec(String(text ?? '').trim().replace(',', '.'));
  return m ? Number(m[1]) * 100 + Number((m[2] ?? '').padEnd(2, '0')) : null;
}

/** Piasters -> text for an input field ("450.00"). */
export const toEgpInput = (piasters) => (piasters / 100).toFixed(2);
