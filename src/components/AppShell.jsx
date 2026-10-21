import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { api } from '../app/api.js';
import { logout } from '../features/auth/authSlice.js';
import { t } from '../i18n/t.js';
import Button from './Button.jsx';
import Logo from './Logo.jsx';

export default function AppShell() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const signOut = () => {
    dispatch(logout());
    dispatch(api.util.resetApiState());
  };
  return (
    <>
      <header className="app-header">
        <Logo size={44} />
        <div className="app-header-title">
          <strong>{t('app.title')}</strong>
          <span>{user.name} · {t(`role.${user.role}`)}</span>
        </div>
        <Button onClick={signOut}>{t('auth.logout')}</Button>
      </header>
      <main className="page"><Outlet /></main>
    </>
  );
}
