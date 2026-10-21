import { createContext, useId } from 'react';

export const GroupContext = createContext(false);

/** A card that gathers related sections under one heading. `area` places it in the page grid (see base.css). Sections inside it become flat blocks with an h3. */
export default function Group({ title, area, children }) {
  const id = useId();
  return (
    <section className={area ? `group group-${area}` : 'group'} aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      <GroupContext.Provider value>{children}</GroupContext.Provider>
    </section>
  );
}
