import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  BookOpen, Clock, AlertTriangle, CheckCircle,
  TrendingUp, ArrowUpRight, ArrowRight
} from 'lucide-react';
import type { KPIs, Competence, KnowledgeAsset } from '../types';
import { CONFIDENTIALITY_COLORS } from '../types';

const ASSET_TYPE_EMOJI: Record<string, string> = {
  Procedure: '📋', 'Lesson Learned': '💡', 'Case Study': '📊',
  Guideline: '📖', Standard: '📏', Manual: '📕',
  Template: '📝', Framework: '🏗️', Guide: '📘',
  Checklist: '✅', Report: '📈',
};

export default function Dashboard() {
  const { user, setKpis } = useAuth();
  const navigate = useNavigate();
  const [recent, setRecent] = useState<KnowledgeAsset[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [competences, setCompetences] = useState<Competence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch('/api/dashboard/kpis').then(r => { if (!r.ok) throw new Error('KPIs failed'); return r.json(); }),
      fetch('/api/dashboard/recent').then(r => { if (!r.ok) throw new Error('Recent failed'); return r.json(); }),
      fetch('/api/dashboard/pending-approvals').then(r => { if (!r.ok) throw new Error('Approvals failed'); return r.json(); }),
      fetch('/api/competences').then(r => { if (!r.ok) throw new Error('Competences failed'); return r.json(); }),
    ]).then(([kp, rec, pend, comps]) => {
      if (cancelled) return;
      setKpis(kp);
      setRecent(rec);
      setPending(pend);
      setCompetences(comps);
      setLoading(false);
    }).catch((err) => {
      if (cancelled) return;
      console.error('Dashboard load error:', err);
      setError(err.message);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Show loading skeleton
  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-slate-200 rounded-xl" />)}
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-64 bg-slate-200 rounded-xl" />
            <div className="h-64 bg-slate-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6 md:p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="font-semibold text-red-900 mb-2">Unable to load dashboard</h2>
          <p className="text-sm text-red-600 mb-4">{error}. Make sure the backend is running on port 8000.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const kpis_data = useAuth().kpis;
  const kpiCards = [
    { label: 'Total Assets', value: kpis_data?.total_assets || 0, icon: BookOpen, color: 'text-primary-500', bg: 'bg-primary-50', change: `+${kpis_data?.published_this_month || 0} this month` },
    { label: 'Pending Reviews', value: kpis_data?.pending_reviews || 0, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', change: `${kpis_data?.approval_queue || 0} in queue` },
    { label: 'Overdue Documents', value: kpis_data?.overdue_docs || 0, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', change: 'Action needed' },
    { label: 'Active Competences', value: kpis_data?.active_competences || 0, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50', change: `${kpis_data?.active_users || 0} active users` },
  ];

  const roleMessage = user?.role === 'Admin' ? 'Full governance oversight across all competences.'
    : user?.role === 'Leader' ? `Leading ${user?.competence}. Review pending submissions and monitor knowledge quality.`
    : user?.role === 'Champion' ? 'Review submissions and support knowledge sharing across competences.'
    : user?.role === 'Employee' ? 'Browse, search, and contribute to the knowledge base.'
    : 'Welcome to NorthStar. Search, browse, and discover knowledge across all competence areas.';

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {user?.name?.split(' ')[0] || 'User'}
        </h1>
        <p className="text-slate-500 mt-1">{roleMessage}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpiCards.map(kpi => (
          <div key={kpi.label} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center mb-3`}>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{kpi.label}</p>
            <p className="text-xs text-slate-400 mt-2">{kpi.change}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recently Updated */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Recently Updated</h2>
              <button onClick={() => navigate('/library')} className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {recent.slice(0, 8).map(asset => (
              <div key={asset.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate(`/assets/${asset.id}`)}>
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">{ASSET_TYPE_EMOJI[asset.asset_type] || '📄'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{asset.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {asset.competence?.name || 'Unassigned'} &bull; Updated {new Date(asset.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border shrink-0 ${CONFIDENTIALITY_COLORS[asset.confidentiality]?.bg || 'bg-gray-50'} ${CONFIDENTIALITY_COLORS[asset.confidentiality]?.text || 'text-gray-600'} ${CONFIDENTIALITY_COLORS[asset.confidentiality]?.border || 'border-gray-200'}`}>
                    {asset.confidentiality}
                  </span>
                </div>
              </div>
            ))}
            {recent.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-400">No recently updated assets.</div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-2.5">
              <button onClick={() => navigate('/search')} className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-primary-300 hover:bg-primary-50/50 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-sm">🔍</div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Spiral Search</p>
                  <p className="text-xs text-slate-400">Search across 8 knowledge layers</p>
                </div>
              </button>
              <button onClick={() => navigate('/library')} className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-primary-300 hover:bg-primary-50/50 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-sm">📚</div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Browse Library</p>
                  <p className="text-xs text-slate-400">{kpis_data?.total_assets || 30} knowledge assets across 7 competences</p>
                </div>
              </button>
              <button onClick={() => navigate('/competences')} className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-primary-300 hover:bg-primary-50/50 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-sm">🗂️</div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Competence Spaces</p>
                  <p className="text-xs text-slate-400">Explore 7 knowledge domains</p>
                </div>
              </button>
            </div>
          </div>

          {/* Pending Approvals */}
          {pending.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="p-5 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900">Pending Approvals</h2>
              </div>
              <div className="p-4 space-y-3">
                {pending.map(item => (
                  <div key={item.id} className="p-3 rounded-lg bg-amber-50 border border-amber-200 cursor-pointer hover:bg-amber-100 transition-colors" onClick={() => item.asset?.id && navigate(`/assets/${item.asset.id}`)}>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium text-amber-800">{item.asset?.title || 'Unknown Asset'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-amber-600">{item.current_stage}</span>
                      <span className="text-xs text-amber-400">&bull;</span>
                      <span className="text-xs text-amber-500">by {item.submitted_user?.name || 'Unknown'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Competence Quick Access */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900">Competence Spaces</h2>
          <button onClick={() => navigate('/competences')} className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">
            Browse all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {competences.map(c => (
            <div
              key={c.id}
              onClick={() => navigate(`/competences/${c.id}`)}
              className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-200 transition-all cursor-pointer text-center"
            >
              <div className="w-10 h-10 mx-auto rounded-lg flex items-center justify-center text-lg mb-2" style={{ backgroundColor: (c.color || '#0ea5e9') + '15' }}>
                <span style={{ color: c.color || '#0ea5e9' }}>
                  {c.icon === 'Zap' && '⚡'}
                  {c.icon === 'Settings' && '⚙️'}
                  {c.icon === 'Cpu' && '🔧'}
                  {c.icon === 'Headphones' && '🎧'}
                  {c.icon === 'Wrench' && '🔩'}
                  {c.icon === 'CheckCircle' && '✅'}
                  {c.icon === 'Briefcase' && '💼'}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-700 leading-tight">{c.name}</p>
              <p className="text-[10px] text-slate-400 mt-1">{c.asset_count} assets</p>
            </div>
          ))}
          {competences.length === 0 && (
            <div className="col-span-full text-center text-sm text-slate-400 py-8">No competences found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
