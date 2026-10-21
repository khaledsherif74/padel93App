import { t } from '../i18n/t.js';

// The ONLY place API errors become user messages. Server shape: { error: { code, message, details } }.
export const errorCode = (err) =>
  err?.data?.error?.code ?? (err?.status === 'FETCH_ERROR' ? 'NETWORK' : 'UNKNOWN');

export function errorText(err) {
  const code = errorCode(err);
  if (code === 'NETWORK') return t('error.network');
  if (code === 'MAINTENANCE') return t('error.maintenance');
  return err?.data?.error?.message ?? t('error.unknown');
}
