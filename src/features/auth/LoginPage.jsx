import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Banner from '../../components/Banner.jsx';
import Button from '../../components/Button.jsx';
import { Field } from '../../components/Field.jsx';
import Logo from '../../components/Logo.jsx';
import { t } from '../../i18n/t.js';
import { useAction } from '../../lib/useAction.js';
import { useLoginMutation } from './authApi.js';

export default function LoginPage() {
  const token = useSelector((s) => s.auth.token);
  const [login] = useLoginMutation();
  const [form, setForm] = useState({ username: '', password: '' });
  const action = useAction();
  if (token) return <Navigate to="/closing" replace />;

  const submit = (e) => {
    e.preventDefault();
    action.run(() => login(form).unwrap());
  };

  return (
    <main className="login">
      <Logo size={132} />
      <h1>{t('login.title')}</h1>
      <form onSubmit={submit} className="stack">
        <Field label={t('login.username')}>
          <input autoComplete="username" autoCapitalize="none" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        </Field>
        <Field label={t('login.password')}>
          <input type="password" autoComplete="current-password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </Field>
        {action.error && <Banner tone="danger">{action.error}</Banner>}
        <Button type="submit" variant="primary" busy={action.busy}>{t('login.submit')}</Button>
      </form>
    </main>
  );
}
