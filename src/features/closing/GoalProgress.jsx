import QueryState from '../../components/QueryState.jsx';
import { t } from '../../i18n/t.js';
import { useGetGoalQuery } from './closingApi.js';

/** Monthly goal: hours played so far and hours still to go. Rendered only for people with `goal.view`. */
export default function GoalProgress({ month, permissions }) {
  const query = useGetGoalQuery(month, { skip: !permissions['goal.view'] });
  if (!permissions['goal.view']) return null;
  return (
    <div className="stack">
      <h3>{t('goal.title')}</h3>
      <QueryState query={query}>
        {(g) => g.goal === null ? <p className="muted">{t('goal.none')}</p> : (
          <>
            <progress value={g.completedHours} max={g.goalHours} aria-label={t('goal.title')} />
            <p>{t('goal.done', { done: g.completedHours, goal: g.goalHours })} · {t('goal.left', { left: g.remainingToPlayHours })}</p>
          </>
        )}
      </QueryState>
    </div>
  );
}
