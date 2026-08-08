import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  BookOpen, Clock, AlertTriangle, TrendingUp,
  ArrowRight, FileText, Search, Library,
  LayoutGrid, Shield, ChevronRight, RefreshCw
} from 'lucide-react';
import type { KPIs, KnowledgeAsset, Competence } from '../types';
import { CONFIDENTIALITY_COLORS } from '../types';

const ASSET_TYPE_EMOJI: Record<string, string> = {
  Procedure: '📋', 'Lesson Learned': '💡', 'Case Study': '📊',
  Guideline: '📖', Standard: '📏', Manual: '📕',
  Template: '📝', Framework: '🏗️', Guide: '📘',
  Checklist: '✅', Report: '📈',
};

const FALLBACK_KPIS: KPIs = {
  total_assets: 30, pending_reviews: 3, overdue_docs: 0,
  active_competences: 7, published_this_month: 8,
  active_users: 7, approval_queue: 3, avg_review_time: '5 days',
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [kpis, setKpis] = useState<KPIs>(FALLBACK_KPIS);
  const [recent, setRecent] = useState<KnowledgeAsset[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [k, r, p] = await Promise.all([
        fetch('/api/dashboard/kpis').then(r => r.ok ? r.json() : FALLBACK_KPIS),
        fetch('/api/dashboard/recent').then(r => r.ok ? r.json() : []),
        fetch('/api/dashboard/pending-approvals').then(r => r.ok ? r.json() : []),
      ]);
      setKpis(k);
      setRecent(r);
      setPending(p);
    } catch {
      // Keep fallback data
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleRefresh = () => { setRefreshing(true); loadData(); };

  const kpiCards = [
    { label: 'Total Assets', value: kpis.total_assets, icon: BookOpen, color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200', change: `+${kpis.published_this_month} this month` },
    { label: 'Pending Reviews', value: kpis.pending_reviews, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', change: `${kpis.approval_queue} in queue` },
    { label: 'Overdue Documents', value: kpis.overdue_docs, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', change: kpis.overdue_docs > 0 ? 'Action needed' : 'All on track' },
    { label: 'Active Competences', value: kpis.active_competences, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', change: `${kpis.active_users} active users` },
  ];

  const roleMessage = user?.role === 'Admin' ? 'Full governance oversight across all competences.'
    : user?.role === 'Leader' ? `Leading ${user?.competence}. Review pending submissions.`
    : user?.role === 'Champion' ? 'Review submissions and support knowledge sharing.'
    : 'Browse, search, and contribute to the knowledge base.';

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-9 bg-slate-200 rounded-lg w-64" />
          <div className="h-5 bg-slate-100 rounded w-96" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-28 bg-slate-200 rounded-xl" />)}
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-72 bg-slate-200 rounded-xl" />
            <div className="h-72 bg-slate-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-slate-500 mt-1">{roleMessage}</p>
        </div>
        <button onClick={handleRefresh} disabled={refreshing}
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors"
          title="Refresh">
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpiCards.map(kpi => (
          <div key={kpi.label} className={`${kpi.bg} ${kpi.border} border rounded-xl p-5`}>
            <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center mb-3 border ${kpi.border}`}>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <p className="text-3xl font-bold text-slate-900">{kpi.value}</p>
            <p className="text-sm text-slate-500 mt-1">{kpi.label}</p>
            <p className={`text-xs mt-2 ${kpi.color} font-medium`}>{kpi.change}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recently Updated */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recently Updated</h2>
            <button onClick={() => navigate('/library')} className="text-sm text-sky-600 hover:text-sky-700 flex items-center gap-1 font-medium">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {recent.length > 0 ? recent.slice(0, 8).map(asset => (
              <div key={asset.id} onClick={() => navigate(`/assets/${asset.id}`)}
                className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3">
                <span className="text-xl mt-0.5">{ASSET_TYPE_EMOJI[asset.asset_type] || '📄'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{asset.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {asset.competence?.name || 'Unassigned'} &bull; Updated {new Date(asset.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${CONFIDENTIALITY_COLORS[asset.confidentiality]?.bg || 'bg-gray-50'} ${CONFIDENTIALITY_COLORS[asset.confidentiality]?.text || 'text-gray-600'} ${CONFIDENTIALITY_COLORS[asset.confidentiality]?.border || 'border-gray-200'}`}>
                  {asset.confidentiality}
                </span>
              </div>
            )) : (
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
              <button onClick={() => navigate('/search')} className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sm">🔍</div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Spiral Search</p>
                  <p className="text-xs text-slate-400">Search across 8 knowledge layers</p>
                </div>
              </button>
              <button onClick={() => navigate('/library')} className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-sm">📚</div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Browse Library</p>
                  <p className="text-xs text-slate-400">{kpis.total_assets} knowledge assets across {kpis.active_competences} competences</p>
                </div>
              </button>
              <button onClick={() => navigate('/competences')} className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-colors text-left">
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
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">Pending Approvals</h2>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{pending.length}</span>
              </div>
              <div className="p-4 space-y-3">
                {pending.slice(0, 4).map(item => (
                  <div key={item.id} onClick={() => navigate(`/assets/${item.asset_id || item.id}`)}
                    className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                    <p className="text-sm font-medium text-slate-900 truncate">{item.asset?.title || `Asset #${item.asset_id}`}</p>
                    <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                      {item.current_stage}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Governance Stats */}
          <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-sky-200" />
              <h3 className="font-semibold text-sm">Governance Status</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-2xl font-bold">{kpis.approval_queue}</p>
                <p className="text-xs text-sky-100">In Review</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-2xl font-bold">{kpis.published_this_month}</p>
                <p className="text-xs text-sky-100">Published</p>
              </div>
            </div>
            <p className="text-xs text-sky-100 mt-3">Avg review time: {kpis.avg_review_time}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
