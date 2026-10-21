import { t } from '../../i18n/t.js';
import QueryState from '../../components/QueryState.jsx';
import ClosingView from './ClosingView.jsx';
import OpenShiftForm from './OpenShiftForm.jsx';
import ShiftPicker from './ShiftPicker.jsx';
import { useShiftTarget } from './useShiftTarget.js';

export default function ClosingPage() {
  const target = useShiftTarget();
  return (
    <QueryState query={target.query}>
      {() => (
        <>
          {!target.isStaff && <ShiftPicker shifts={target.shifts} value={target.shift?.id} onChange={target.pick} />}
          {target.shift && <ClosingView key={target.shift.id} shift={target.shift} />}
          {!target.shift && target.isStaff && <OpenShiftForm />}
          {!target.shift && !target.isStaff && <p className="muted">{t('closing.noShifts')}</p>}
        </>
      )}
    </QueryState>
  );
}
