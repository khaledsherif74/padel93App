import { t } from '../i18n/t.js';

// The ONLY place API errors become user messages. Server shape: { error: { code, message, details } }.
export const errorCode = (err) =>
  err?.data?.error?.code ?? (err?.status === 'FETCH_ERROR' ? 'NETWORK' : 'UNKNOWN');

export function errorText(err) {
  const code = errorCode(err);
  if (code === 'NETWORK') return t('error.network');
  if (code === 'MAINTENANCE') return t('error.maintenance');
  const { message, details } = err?.data?.error ?? {};
  // Validation errors name the field, so a rejected request says WHAT is wrong, not just "Invalid request".
  if (code === 'VALIDATION_ERROR' && Array.isArray(details)) {
    return [message, ...details.map((d) => `${d.path}: ${d.message}`)].join(' · ');
  }
  return message ?? t('error.unknown');
}
