import { useState } from 'react';
import Banner from '../../components/Banner.jsx';
import Button from '../../components/Button.jsx';
import { AmountInput } from '../../components/Field.jsx';
import Section from '../../components/Section.jsx';
import { t } from '../../i18n/t.js';
import { parseEgp } from '../../lib/money.js';
import { useAction } from '../../lib/useAction.js';
import { useRequestId } from '../../lib/useRequestId.js';
import { useOpenShiftMutation } from './closingApi.js';

export default function OpenShiftForm() {
  const [openShift] = useOpenShiftMutation();
  const [amount, setAmount] = useState('');
  const action = useAction();
  const openingFloat = parseEgp(amount);
  const clientRequestId = useRequestId(amount);

  return (
    <Section title={t('open.title')}>
      <form className="stack" onSubmit={(e) => { e.preventDefault(); action.run(() => openShift({ openingFloat, clientRequestId }).unwrap()); }}>
        <p>{t('open.intro')}</p>
        <AmountInput label={t('open.float')} value={amount} onChange={setAmount} hint={t('open.floatHint')} />
        {action.error && <Banner tone="danger">{action.error}</Banner>}
        <Button type="submit" variant="primary" busy={action.busy} disabled={openingFloat == null}>{t('open.submit')}</Button>
      </form>
    </Section>
  );
}
