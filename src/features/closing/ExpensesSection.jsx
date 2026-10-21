import { useState } from 'react';
import Button from '../../components/Button.jsx';
import QueryState from '../../components/QueryState.jsx';
import Section from '../../components/Section.jsx';
import { t } from '../../i18n/t.js';
import { formatEgp } from '../../lib/money.js';
import AdvanceDialog from './AdvanceDialog.jsx';
import ExpenseDialog from './ExpenseDialog.jsx';

/** Cash that left the drawer today: needs, supplier purchases (Excel "market supp") and staff advances (salaf). */
export default function ExpensesSection({ summary, canEdit, permissions }) {
  const [dialog, setDialog] = useState(null); // 'expense' | 'advance'
  const mayAdd = canEdit && permissions['expense.create'];
  const actions = mayAdd && (
    <div className="actions">
      <Button onClick={() => setDialog('expense')}>{t('expense.add')}</Button>
      <Button onClick={() => setDialog('advance')}>{t('advance.add')}</Button>
    </div>
  );

  return (
    <Section title={t('expenses.title')} action={actions || null}>
      <QueryState query={summary} isEmpty={(d) => !d.expenses.items.length} emptyText={t('expenses.empty')}>
        {({ expenses }) => (
          <>
            <ul className="lines">
              {expenses.items.map((e) => (
                <li key={e.id}><span>{e.advanceFor ? t('expenses.advanceTo', { name: e.advanceFor }) : `${e.category} · ${e.description}`}</span><strong>{formatEgp(e.amount)}</strong></li>
              ))}
            </ul>
            <p className="total"><span>{t('expenses.total')}</span><strong>{formatEgp(expenses.total)}</strong></p>
          </>
        )}
      </QueryState>
      {dialog === 'expense' && <ExpenseDialog onClose={() => setDialog(null)} />}
      {dialog === 'advance' && <AdvanceDialog onClose={() => setDialog(null)} />}
    </Section>
  );
}
