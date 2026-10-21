import { Link } from 'react-router-dom';
import { t } from '../i18n/t.js';

export default function NotFound() {
  return (
    <section className="section">
      <h1>{t('notFound.title')}</h1>
      <p>{t('notFound.body')}</p>
      <Link className="btn btn-primary" to="/closing">{t('notFound.back')}</Link>
    </section>
  );
}
