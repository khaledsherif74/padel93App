import { t } from '../i18n/t.js';

export default function Logo({ size = 40 }) {
  return <img src="/logo.png" alt={t('brand.name')} width={size} height={size} />;
}
