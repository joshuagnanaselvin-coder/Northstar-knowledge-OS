import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  ArrowLeft, Users, FileText, Lightbulb, UserCheck,
  GraduationCap, CheckCircle, Lock, Clock, Tag,
  Zap, Settings, Cpu, Headphones, Wrench, Briefcase
} from 'lucide-react';
import type { Competence } from '../types';
import { CONFIDENTIALITY_COLORS } from '../types';

type TabId = 'overview' | 'documents' | 'lessons' | 'experts' | 'training' | 'approvals' | 'confidential';

const TABS: { id: TabId; label: string; icon: React.ReactNode; adminOnly?: boolean }[] = [
  { id: 'overview', label: 'Overview', icon: <FileText className="w-4 h-4" /> },
  { id: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
  { id: 'lessons', label: 'Lessons Learned', icon: <Lightbulb className="w-4 h-4" /> },
  { id: 'experts', label: 'Experts', icon: <UserCheck className="w-4 h-4" /> },
  { id: 'training', label: 'Training', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'approvals', label: 'Approval Queue', icon: <CheckCircle className="w-4 h-4" /> },
  { id: 'confidential', label: 'Confidential Area', icon: <Lock className="w-4 h-4" />, adminOnly: true },
];

export default function CompetenceDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<Competence | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/competences/${id}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-64" />
          <div className="h-64 bg-slate-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 md:p-8">
        <p className="text-slate-500">Competence not found.</p>
      </div>
    );
  }

  const visibleTabs = TABS.filter(t => !t.adminOnly || user?.role === 'Admin');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Assets', value: data.asset_count, icon: '📄' },
                { label: 'Members', value: data.member_count, icon: '👥' },
                { label: 'Experts', value: data.experts?.length || 0, icon: '🎓' },
                { label: 'Training', value: data.training?.length || 0, icon: '📚' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-lg p-4 border border-slate-200 text-center">
                  <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-sm text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-lg p-5 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{data.description}</p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-3">Knowledge Areas</h3>
              <div className="flex flex-wrap gap-2">
                {['Core Standards', 'Procedures', 'Lessons Learned', 'Case Studies', 'Guidelines', 'Templates', 'Audit Records'].map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                    <Tag className="w-3 h-3" />{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.assets?.filter(a => a.asset_type !== 'Lesson Learned').map(asset => (
              <div key={asset.id} onClick={() => navigate(`/assets/${asset.id}`)} className="bg-white rounded-lg p-4 border border-slate-200 hover:border-primary-200 hover:shadow-sm cursor-pointer transition-all">
                <p className="text-sm font-medium text-slate-900 mb-1">{asset.title}</p>
                <p className="text-xs text-slate-400 mb-2 line-clamp-2">{asset.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-500">{asset.asset_type}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${CONFIDENTIALITY_COLORS[asset.confidentiality]?.bg} ${CONFIDENTIALITY_COLORS[asset.confidentiality]?.text} ${CONFIDENTIALITY_COLORS[asset.confidentiality]?.border}`}>
                    {asset.confidentiality}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'lessons':
        return (
          <div className="space-y-4">
            {data.lessons_learned?.map(ll => (
              <div key={ll.id} onClick={() => navigate(`/assets/${ll.id}`)} className="bg-white rounded-lg p-5 border border-slate-200 hover:border-primary-200 cursor-pointer transition-all">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">💡</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{ll.title}</p>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{ll.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-slate-400">by {ll.owner?.name}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-400">{ll.version}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {!data.lessons_learned?.length && (
              <p className="text-sm text-slate-400 text-center py-8">No lessons learned recorded for this competence yet.</p>
            )}
          </div>
        );

      case 'experts':
        return (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.experts?.map(expert => (
              <div key={expert.id} className="bg-white rounded-lg p-5 border border-slate-200 flex items-center gap-4">
                {expert.avatar ? (
                  <img src={expert.avatar} alt="" className="w-12 h-12 rounded-full bg-slate-100" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-lg font-bold text-primary-600">
                    {expert.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <div>
                  <p className="font-medium text-slate-900">{expert.name}</p>
                  <p className="text-sm text-primary-500">{expert.role}</p>
                  <p className="text-xs text-slate-400">{expert.competence}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'training':
        return (
          <div className="space-y-4">
            {data.training?.map((t: any, i: number) => (
              <div key={i} className="bg-white rounded-lg p-5 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{t.title}</p>
                    <p className="text-xs text-slate-400">{t.duration} • {t.format}</p>
                  </div>
                </div>
                <span className="text-xs px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full font-medium">{t.status}</span>
              </div>
            ))}
          </div>
        );

      case 'approvals':
        return (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-500" />
              <p className="text-sm text-amber-700">No pending approvals in this competence.</p>
            </div>
          </div>
        );

      case 'confidential':
        return (
          <div className="space-y-4">
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 flex items-center gap-3">
              <Lock className="w-5 h-5 text-rose-500" />
              <div>
                <p className="text-sm font-medium text-rose-700">Leadership-Only Content</p>
                <p className="text-xs text-rose-500">This area contains sensitive governance documents and strategic plans.</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-5 border border-slate-200">
              <h3 className="font-medium text-slate-900 mb-3">Restricted Documents</h3>
              <div className="space-y-2">
                {['Competence Strategy 2025-2026', 'Leadership Succession Plan', 'Budget Allocation - Confidential'].map(doc => (
                  <div key={doc} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Lock className="w-4 h-4 text-rose-400" />
                    <span className="text-sm text-slate-700">{doc}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full ml-auto">L3</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <button
        onClick={() => navigate('/competences')}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Competences
      </button>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100" style={{ background: `linear-gradient(135deg, ${(data.color || '#0ea5e9')}08, ${(data.color || '#0ea5e9')}02)` }}>
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: (data.color || '#0ea5e9') + '15', color: data.color || '#0ea5e9' }}
            >
              {data.icon === 'Zap' && <Zap className="w-7 h-7" />}
              {data.icon === 'Settings' && <Settings className="w-7 h-7" />}
              {data.icon === 'Cpu' && <Cpu className="w-7 h-7" />}
              {data.icon === 'Headphones' && <Headphones className="w-7 h-7" />}
              {data.icon === 'Wrench' && <Wrench className="w-7 h-7" />}
              {data.icon === 'CheckCircle' && <CheckCircle className="w-7 h-7" />}
              {data.icon === 'Briefcase' && <Briefcase className="w-7 h-7" />}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-slate-900">{data.name}</h1>
              <p className="text-sm text-slate-500 mt-1">{data.description}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Users className="w-3.5 h-3.5" /> {data.member_count} members
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <FileText className="w-3.5 h-3.5" /> {data.asset_count} assets
                </span>
                {data.leader && (
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <UserCheck className="w-3.5 h-3.5" /> {data.leader.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 overflow-x-auto">
          <div className="flex px-2 gap-0">
            {visibleTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
