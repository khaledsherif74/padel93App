import { t } from '../i18n/t.js';
import Banner from './Banner.jsx';
import Button from './Button.jsx';
import Dialog from './Dialog.jsx';

/** Every dialog in the app: title, fields, error, Cancel + one action. Submit is disabled while saving. */
export default function FormDialog({ title, submitLabel, busy, error, disabled, onSubmit, onClose, children }) {
  return (
    <Dialog title={title} onClose={busy ? () => {} : onClose}>
      <form className="stack" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        {children}
        {error && <Banner tone="danger">{error}</Banner>}
        <div className="actions">
          <Button onClick={onClose} disabled={busy}>{t('common.cancel')}</Button>
          <Button type="submit" variant="primary" busy={busy} disabled={disabled}>{submitLabel}</Button>
        </div>
      </form>
    </Dialog>
  );
}
