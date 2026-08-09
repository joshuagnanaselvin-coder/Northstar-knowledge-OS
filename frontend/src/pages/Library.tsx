import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { api } from '../api';
import type { KnowledgeAsset } from '../types';
import { CONFIDENTIALITY_COLORS, STATUS_COLORS, TYPE_ICONS } from '../types';

export default function Library() {
  const [assets, setAssets] = useState<KnowledgeAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterConf, setFilterConf] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch(api('/api/assets')).then(r => r.json()),
      fetch(api('/api/assets/filters/options')).then(r => r.json()),
    ]).then(([data, opts]) => {
      setAssets(data);
      setFilterOptions(opts);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = assets.filter(a => {
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase()) && !(a.description || '').toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterType && a.asset_type !== filterType) return false;
    if (filterConf && a.confidentiality !== filterConf) return false;
    if (filterStatus && a.status !== filterStatus) return false;
    return true;
  });

  const activeFilters = [filterType, filterConf, filterStatus].filter(Boolean).length;

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Knowledge Library</h1>
        <p className="text-slate-500 mt-1">{assets.length} knowledge assets across 7 competences</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search assets by title or description..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
              filterOpen || activeFilters > 0
                ? 'border-primary-300 bg-primary-50 text-primary-700'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters {activeFilters > 0 && `(${activeFilters})`}
          </button>
        </div>

        {filterOpen && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Asset Type</label>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                <option value="">All Types</option>
                {filterOptions?.asset_types?.map((t: string) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Confidentiality</label>
              <select value={filterConf} onChange={e => setFilterConf(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                <option value="">All Levels</option>
                {filterOptions?.confidentialities?.map((c: string) => <option key={c} value={c}>{c} — {c === 'L0' ? 'Public' : c === 'L1' ? 'Competence' : c === 'L2' ? 'Restricted' : 'Leadership'}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                <option value="">All Statuses</option>
                {filterOptions?.statuses?.map((s: string) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500 mb-4">{filtered.length} results found</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(asset => (
              <div
                key={asset.id}
                onClick={() => navigate(`/assets/${asset.id}`)}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-200 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{TYPE_ICONS[asset.asset_type] || '📄'}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${CONFIDENTIALITY_COLORS[asset.confidentiality]?.bg} ${CONFIDENTIALITY_COLORS[asset.confidentiality]?.text} ${CONFIDENTIALITY_COLORS[asset.confidentiality]?.border} font-medium`}>
                      {asset.confidentiality}
                    </span>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">{asset.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">{asset.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{asset.asset_type}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${STATUS_COLORS[asset.status]?.bg} ${STATUS_COLORS[asset.status]?.text} ${STATUS_COLORS[asset.status]?.border}`}>
                      {asset.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">v{asset.version}</span>
                </div>
                {asset.competence && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-400">{asset.competence.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
