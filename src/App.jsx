import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell.jsx';
import LoginPage from './features/auth/LoginPage.jsx';
import RequireAuth from './features/auth/RequireAuth.jsx';
import ClosingPage from './features/closing/ClosingPage.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/closing" replace />} />
          <Route path="/closing" element={<ClosingPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}
