import { t } from '../i18n/t.js';
import { errorText } from '../lib/apiErrors.js';
import Button from './Button.jsx';

/** Loading, error (with retry) and empty states for any RTK Query result. `children` gets the data. */
export default function QueryState({ query, isEmpty, emptyText, children }) {
  if (query.isLoading) return <p role="status" className="muted">{t('common.loading')}</p>;
  if (query.isError) {
    return (
      <div role="alert" className="banner banner-danger">
        <span>{errorText(query.error)}</span>
        <Button onClick={query.refetch}>{t('common.retry')}</Button>
      </div>
    );
  }
  if (isEmpty?.(query.data)) return <p className="muted">{emptyText}</p>;
  return children(query.data);
}
