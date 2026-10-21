import { useContext, useId } from 'react';
import { GroupContext } from './Group.jsx';

export default function Section({ title, action, children }) {
  const id = useId();
  const nested = useContext(GroupContext);
  const Heading = nested ? 'h3' : 'h2';
  return (
    <section className="section" aria-labelledby={id}>
      <header className="section-head">
        <Heading id={id}>{title}</Heading>
        {action}
      </header>
      {children}
    </section>
  );
}
