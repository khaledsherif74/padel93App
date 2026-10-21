import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import QueryState from '../../components/QueryState.jsx';
import { useMeQuery } from './authApi.js';

export default function RequireAuth() {
  const { token, user } = useSelector((s) => s.auth);
  const me = useMeQuery(undefined, { skip: !token || Boolean(user) });
  if (!token) return <Navigate to="/login" replace />;
  if (!user) return <main className="page"><QueryState query={me}>{() => null}</QueryState></main>;
  return <Outlet />;
}
