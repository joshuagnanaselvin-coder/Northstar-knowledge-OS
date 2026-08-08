import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Competences from './pages/Competences';
import CompetenceDetail from './pages/CompetenceDetail';
import Library from './pages/Library';
import AssetDetail from './pages/AssetDetail';
import SpiralSearch from './pages/SpiralSearch';
import Approvals from './pages/Approvals';
import SubmitKnowledge from './pages/SubmitKnowledge';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/competences" element={<Competences />} />
        <Route path="/competences/:id" element={<CompetenceDetail />} />
        <Route path="/library" element={<Library />} />
        <Route path="/assets/:id" element={<AssetDetail />} />
        <Route path="/search" element={<SpiralSearch />} />
        <Route path="/approvals" element={<Approvals />} />
        <Route path="/submit" element={<SubmitKnowledge />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
