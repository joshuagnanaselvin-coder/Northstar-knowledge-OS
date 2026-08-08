import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Globe, Shield, Users, TrendingUp, Search, BookOpen } from 'lucide-react';
import { CONFIDENTIALITY_COLORS } from '../types';

const ROLES = ['Community Member', 'Employee', 'Champion', 'Leader', 'Admin'] as const;
const DEMO_USERS: Record<string, string> = {
  Admin: 'Alice Chen',
  Leader: 'Marcus Johansson',
  Champion: 'David Okafor',
  Employee: 'Elena Rodriguez',
  'Community Member': 'Jordan Taylor',
};

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('Community Member');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const name = DEMO_USERS[selectedRole] || DEMO_USERS['Community Member'];
      await login(name, selectedRole);
      navigate('/');
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-500 mb-4">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">NorthStar Knowledge OS</h1>
            <p className="text-sm text-slate-500 mt-1">Governed Knowledge Management Platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Access Role</label>
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              >
                {ROLES.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <p className="text-xs text-slate-400 mt-1.5">
                Demo: Logging in as <strong>{DEMO_USERS[selectedRole] || DEMO_USERS.Employee}</strong>
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-xs font-medium text-slate-600 mb-2">Role Capabilities:</p>
              <div className="space-y-1">
                {selectedRole === 'Admin' && (
                  <>
                    <p className="text-xs text-slate-500">Full system access, user management, governance oversight</p>
                    <p className="text-xs text-slate-500">All approvals, system configuration, audit logs</p>
                  </>
                )}
                {selectedRole === 'Leader' && (
                  <>
                    <p className="text-xs text-slate-500">Competence leadership, asset approval authority</p>
                    <p className="text-xs text-slate-500">Review submissions, access confidential content</p>
                  </>
                )}
                {selectedRole === 'Champion' && (
                  <>
                    <p className="text-xs text-slate-500">Knowledge review, quality assurance</p>
                    <p className="text-xs text-slate-500">Submit and review knowledge assets, L1-L2 access</p>
                  </>
                )}
                {selectedRole === 'Employee' && (
                  <>
                    <p className="text-xs text-slate-500">Browse competences, search knowledge base</p>
                    <p className="text-xs text-slate-500">Submit knowledge, L0-L1 access</p>
                  </>
                )}
                {selectedRole === 'Community Member' && (
                  <>
                    <p className="text-xs text-slate-500">Search and browse public knowledge assets</p>
                    <p className="text-xs text-slate-500">Access L0 public content, request membership upgrade</p>
                  </>
                )}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In to Knowledge OS'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> ISO 30401</span>
              <span>•</span>
              <span>Prototype v1.0</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> 7 Users</span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500">Demo project — No real company data. All content is synthetic.</p>
        </div>
      </div>
    </div>
  );
}
