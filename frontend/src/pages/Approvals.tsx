import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CheckCircle, Clock, AlertTriangle, Eye, ArrowRight } from 'lucide-react';
import type { ApprovalWorkflow } from '../types';
import { STATUS_COLORS } from '../types';

export default function Approvals() {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState<ApprovalWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/approvals')
      .then(r => r.json())
      .then(data => { setApprovals(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const stageColor = (stage: string) => {
    if (STATUS_COLORS[stage]) return STATUS_COLORS[stage];
    return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' };
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Approval Queue</h1>
        <p className="text-slate-500 mt-1">Review and manage knowledge asset approval workflows</p>
      </div>

      {/* Workflow Stages Legend */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
        <h3 className="font-medium text-slate-900 text-sm mb-3">Approval Workflow Stages</h3>
        <div className="flex flex-wrap gap-2">
          {['Draft', 'Submitted', 'Champion Review', 'Leader Approval', 'Published', 'Review Due', 'Archived'].map((stage, i) => (
            <div key={stage} className="flex items-center gap-1.5">
              <div className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${stageColor(stage).bg} ${stageColor(stage).text} ${stageColor(stage).border}`}>
                {stage}
              </div>
              {i < 6 && <span className="text-slate-300">→</span>}
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-200 rounded-xl animate-pulse" />)}
        </div>
      ) : approvals.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
          <CheckCircle className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
          <p className="text-slate-500">No pending approvals at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {approvals.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-slate-900">{item.asset?.title || 'Unknown Asset'}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{item.asset?.competence?.name || 'Unassigned'}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${stageColor(item.current_stage).bg} ${stageColor(item.current_stage).text} ${stageColor(item.current_stage).border}`}>
                    {item.current_stage}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                  <span>Submitted by {item.submitted_user?.name || 'Unknown'}</span>
                  <span>•</span>
                  <span>{new Date(item.submitted_at).toLocaleDateString()}</span>
                </div>

                {item.comments && (
                  <div className="bg-slate-50 rounded-lg p-3 mb-3">
                    <p className="text-xs text-slate-600">{item.comments}</p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {item.asset && item.asset.id && (
                    <button
                      onClick={() => navigate(`/assets/${(item.asset as any).id}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Asset
                    </button>
                  )}
                  {(user?.role === 'Leader' || user?.role === 'Champion' || user?.role === 'Admin') && (
                    <>
                      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                        Request Changes
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
