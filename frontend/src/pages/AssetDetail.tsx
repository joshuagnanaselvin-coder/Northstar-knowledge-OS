import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Calendar, Shield, Tag, Link2,
  Clock, CheckCircle, AlertTriangle, FileText, Share2
} from 'lucide-react';
import type { KnowledgeAsset } from '../types';
import { CONFIDENTIALITY_COLORS, STATUS_COLORS, TYPE_ICONS } from '../types';

export default function AssetDetail() {
  const { id } = useParams();
  const [asset, setAsset] = useState<KnowledgeAsset | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/assets/${id}`)
      .then(r => r.json())
      .then(d => { setAsset(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="animate-pulse space-y-4 max-w-4xl">
          <div className="h-8 bg-slate-200 rounded w-96" />
          <div className="h-64 bg-slate-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="p-6 md:p-8">
        <p className="text-slate-500">Asset not found.</p>
      </div>
    );
  }

  const ApprovalStageBadge = () => {
    const stages = ['Draft', 'Submitted', 'Champion Review', 'Leader Approval', 'Published', 'Review Due', 'Archived'];
    const currentIdx = stages.indexOf(asset.status);
    return (
      <div className="flex items-center gap-1 flex-wrap">
        {stages.map((stage, i) => (
          <div key={stage} className="flex items-center gap-1">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
              i <= currentIdx
                ? 'bg-primary-100 text-primary-700'
                : 'bg-slate-100 text-slate-400'
            }`}>
              {i < currentIdx && <CheckCircle className="w-3 h-3" />}
              {i === currentIdx && <Clock className="w-3 h-3" />}
              {i > currentIdx && <div className="w-3 h-3 rounded-full border border-slate-300" />}
              {stage}
            </div>
            {i < stages.length - 1 && <div className="w-3 h-px bg-slate-300" />}
          </div>
        ))}
      </div>
    );
  };

  const tags = asset.tags ? asset.tags.split(',').map(t => t.trim()) : [];
  const relatedDocs = asset.related_docs ? JSON.parse(asset.related_docs || '[]') : [];

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="p-6 md:p-8">
          <div className="flex items-start gap-4 mb-4">
            <span className="text-4xl">{TYPE_ICONS[asset.asset_type] || '📄'}</span>
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">{asset.title}</h1>
              <p className="text-sm text-slate-500 mt-1">{asset.description}</p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${CONFIDENTIALITY_COLORS[asset.confidentiality]?.bg} ${CONFIDENTIALITY_COLORS[asset.confidentiality]?.text} ${CONFIDENTIALITY_COLORS[asset.confidentiality]?.border}`}>
                  <Shield className="w-3 h-3 mr-1" />{asset.confidentiality}
                </span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[asset.status]?.bg} ${STATUS_COLORS[asset.status]?.text} ${STATUS_COLORS[asset.status]?.border}`}>
                  {asset.status === 'Published' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {asset.status === 'Review Due' && <AlertTriangle className="w-3 h-3 mr-1" />}
                  {asset.status}
                </span>
                <span className="text-xs text-slate-400 px-2.5 py-1 bg-slate-100 rounded-full">{asset.asset_type}</span>
                <span className="text-xs text-slate-400">Version {asset.version}</span>
              </div>
            </div>
          </div>

          {/* Approval Workflow */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Approval Workflow</p>
            <ApprovalStageBadge />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              <FileText className="w-4 h-4" /> Download PDF
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              Request Edit Access
            </button>
          </div>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Metadata</h2>
        </div>
        <div className="p-6 grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Owner</p>
            <div className="flex items-center gap-3">
              {asset.owner?.avatar ? (
                <img src={asset.owner.avatar} alt="" className="w-8 h-8 rounded-full bg-slate-100" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-medium text-primary-600">
                  {asset.owner?.name?.split(' ').map((n: string) => n[0]).join('')}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-slate-900">{asset.owner?.name || 'Unassigned'}</p>
                <p className="text-xs text-slate-400">{asset.owner?.department || ''}</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Reviewer</p>
            <div className="flex items-center gap-3">
              {asset.reviewer?.avatar ? (
                <img src={asset.reviewer.avatar} alt="" className="w-8 h-8 rounded-full bg-slate-100" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-500">
                  {asset.reviewer?.name?.split(' ').map((n: string) => n[0]).join('')}
                </div>
              )}
              <p className="text-sm font-medium text-slate-900">{asset.reviewer?.name || 'Unassigned'}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Approver</p>
            <div className="flex items-center gap-3">
              {asset.approver?.avatar ? (
                <img src={asset.approver.avatar} alt="" className="w-8 h-8 rounded-full bg-slate-100" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-500">
                  {asset.approver?.name?.split(' ').map((n: string) => n[0]).join('')}
                </div>
              )}
              <p className="text-sm font-medium text-slate-900">{asset.approver?.name || 'Unassigned'}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Review Date</p>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <p className="text-sm text-slate-700">{asset.review_date ? new Date(asset.review_date).toLocaleDateString() : 'Not set'}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Competence</p>
            <p className="text-sm text-slate-700">{asset.competence?.name || 'Unassigned'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Created</p>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <p className="text-sm text-slate-700">{new Date(asset.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Last Updated</p>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <p className="text-sm text-slate-700">{new Date(asset.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Version</p>
            <p className="text-sm text-slate-700 font-mono">v{asset.version}</p>
          </div>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Tags</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs">
                  <Tag className="w-3 h-3" />{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Related Documents */}
      {relatedDocs.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Related Documents</h2>
          </div>
          <div className="p-4">
            {relatedDocs.map((docId: number) => (
              <div key={docId} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/assets/${docId}`)}>
                <Link2 className="w-4 h-4 text-primary-500" />
                <span className="text-sm text-slate-700">Asset #{docId}</span>
                <ArrowLeft className="w-3.5 h-3.5 text-slate-300 rotate-180 ml-auto" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Preview */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Content</h2>
        </div>
        <div className="p-6">
          <div className="prose prose-sm max-w-none text-slate-600" dangerouslySetInnerHTML={{ __html: asset.content || '<p>No content available.</p>' }} />
        </div>
      </div>
    </div>
  );
}
