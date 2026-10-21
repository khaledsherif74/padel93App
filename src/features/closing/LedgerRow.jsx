/** One line of a statement: label left, amount right. `sign` ("+", "−") shows how it enters the total. */
export default function LedgerRow({ label, value, sign, strong }) {
  return (
    <div className={strong ? 'ledger-row ledger-strong' : 'ledger-row'}>
      <dt>{sign && <span className="ledger-sign" aria-hidden="true">{sign}</span>}{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
