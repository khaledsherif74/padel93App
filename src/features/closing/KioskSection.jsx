import { useState } from "react";
import Button from "../../components/Button.jsx";
import QueryState from "../../components/QueryState.jsx";
import Section from "../../components/Section.jsx";
import { t } from "../../i18n/t.js";
import { formatTime } from "../../lib/dates.js";
import { formatEgp } from "../../lib/money.js";
import { useCreateIncomeMutation } from "./closingApi.js";
import PaymentDialog from "./PaymentDialog.jsx";

/** shop sales NOT tied to a booking (the ones tied to a booking are added from the bookings table). */
export default function shopSection({ summary, canEdit, permissions }) {
  const [createIncome] = useCreateIncomeMutation();
  const [adding, setAdding] = useState(false);
  const add =
    canEdit && permissions["income.create"] ? (
      <Button onClick={() => setAdding(true)}>{t("shop.add")}</Button>
    ) : null;

  return (
    <Section title={t("shop.title")} action={add}>
      <QueryState
        query={summary}
        isEmpty={(d) => !d.shop.items.length}
        emptyText={t("shop.empty")}
      >
        {({ shop }) => (
          <>
            <ul className="lines">
              {shop.items.map((i) => (
                <li key={i.id}>
                  <span>
                    {formatTime(i.recordedAt)} · {i.note} ·{" "}
                    {t(`method.${i.method}`)}
                  </span>
                  <strong>{formatEgp(i.amount)}</strong>
                </li>
              ))}
            </ul>
            <p className="total">
              <span>{t("shop.total")}</span>
              <strong>{formatEgp(shop.outside)}</strong>
            </p>
          </>
        )}
      </QueryState>
      {adding && (
        <PaymentDialog
          title={t("shop.add")}
          allowCard={Boolean(permissions["income.createCard"])}
          noteRequired
          noteLabel={t("shop.note")}
          onSubmit={(v) => createIncome({ source: "SHOP", ...v }).unwrap()}
          onClose={() => setAdding(false)}
        />
      )}
    </Section>
  );
}
