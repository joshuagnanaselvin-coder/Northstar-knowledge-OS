import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, ChevronDown, ChevronUp, FileText, Lightbulb, Link2, Users, GraduationCap, Zap, Loader2 } from 'lucide-react';
import type { SearchResponse } from '../types';

const LAYER_ICONS: Record<string, React.ReactNode> = {
  Documents: <FileText className="w-4 h-4" />,
  'Lessons Learned': <Lightbulb className="w-4 h-4" />,
  Cases: <FileText className="w-4 h-4" />,
  'Cross-Competence': <Link2 className="w-4 h-4" />,
  Experts: <Users className="w-4 h-4" />,
  Training: <GraduationCap className="w-4 h-4" />,
  'Open Actions': <Zap className="w-4 h-4" />,
};

export default function SpiralSearch() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [expandedLayers, setExpandedLayers] = useState<Set<number>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const quickSearches = ['generator shutdown', 'pump failure', 'PLC programming', 'vibration analysis'];

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    setExpandedLayers(new Set());
    try {
      const res = await fetch('/api/search/spiral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResult(data);
      // Auto-expand layers with results
      setExpandedLayers(new Set(data.layers.filter((l: any) => l.count > 0).map((_: any, i: number) => i)));
    } finally {
      setLoading(false);
    }
  };

  const toggleLayer = (index: number) => {
    setExpandedLayers(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <Sparkles className="w-6 h-6 text-primary-500" />
          <h1 className="text-2xl font-bold text-slate-900">Spiral Search</h1>
        </div>
        <p className="text-slate-500 text-sm">Search across 8 knowledge layers — documents, lessons learned, experts, and more</p>
      </div>

      {/* Search Input */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Search knowledge base... (try 'generator shutdown')"
            className="w-full pl-12 pr-28 py-4 bg-white border border-slate-200 rounded-2xl text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white rounded-xl text-sm font-medium transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-xs text-slate-400">Try:</span>
          {quickSearches.map(q => (
            <button
              key={q}
              onClick={() => { setQuery(q); setTimeout(handleSearch, 50); }}
              className="text-xs px-3 py-1 bg-slate-100 text-slate-600 rounded-full hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="max-w-3xl mx-auto space-y-4">
          {/* AI Answer */}
          <div className="bg-gradient-to-br from-primary-50 to-blue-50 border border-primary-200 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-primary-900 text-sm">AI-Generated Answer</h3>
              </div>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed pl-11">{result.ai_answer}</p>
            {result.sources.length > 0 && (
              <div className="mt-3 pl-11">
                <p className="text-xs font-medium text-primary-700 mb-1">Sources:</p>
                <div className="flex flex-wrap gap-2">
                  {result.sources.map((s, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-primary-100/50 text-primary-700 rounded-md">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Layers */}
          {result.layers.map((layer, index) => (
            <div key={layer.layer} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <button
                onClick={() => toggleLayer(index)}
                className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors"
              >
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm">
                  {LAYER_ICONS[layer.layer] || '📄'}
                </span>
                <span className="font-medium text-slate-900 text-sm flex-1 text-left">{layer.layer}</span>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{layer.count} results</span>
                {expandedLayers.has(index) ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>
              {expandedLayers.has(index) && (
                <div className="border-t border-slate-100 p-4 space-y-2">
                  {layer.layer === 'Documents' && layer.items.map((item: any) => (
                    <div key={item.id} onClick={() => navigate(`/assets/${item.id}`)} className="p-3 rounded-lg hover:bg-slate-50 cursor-pointer flex items-start gap-3">
                      <span className="text-lg mt-0.5">📄</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{item.competence?.name} • {item.asset_type}</p>
                      </div>
                    </div>
                  ))}
                  {layer.layer === 'Lessons Learned' && layer.items.map((item: any) => (
                    <div key={item.id} onClick={() => navigate(`/assets/${item.id}`)} className="p-3 rounded-lg hover:bg-slate-50 cursor-pointer flex items-start gap-3">
                      <span className="text-lg">💡</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{item.competence?.name}</p>
                      </div>
                    </div>
                  ))}
                  {layer.layer === 'Cases' && layer.items.map((item: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-50 flex items-start gap-3">
                      <span className="text-lg">📋</span>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.title || 'Case ' + (i + 1)}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{item.description || 'Case study document'}</p>
                      </div>
                    </div>
                  ))}
                  {layer.layer === 'Cross-Competence' && layer.items.map((item: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-50 flex items-center gap-3">
                      <Link2 className="w-4 h-4 text-primary-500" />
                      <span className="text-sm text-slate-700">{item.name}</span>
                      <span className="text-xs text-slate-400 ml-auto">{item.match_count} matches</span>
                    </div>
                  ))}
                  {layer.layer === 'Experts' && layer.items.map((item: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-50 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-medium text-primary-600">
                        {item.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-400">{item.role} • {item.competence}</p>
                      </div>
                    </div>
                  ))}
                  {layer.layer === 'Training' && layer.items.map((item: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-50 flex items-center gap-3">
                      <GraduationCap className="w-4 h-4 text-primary-500" />
                      <span className="text-sm text-slate-700">{item.title}</span>
                      <span className="text-xs text-emerald-600 ml-auto">{item.status}</span>
                    </div>
                  ))}
                  {layer.layer === 'Open Actions' && layer.items.map((item: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3">
                      <Zap className="w-4 h-4 text-amber-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">{item.action}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-amber-600">{item.priority} priority</span>
                          <span className="text-xs text-amber-400">•</span>
                          <span className="text-xs text-amber-500">{item.owner}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {layer.count === 0 && (
                    <p className="text-sm text-slate-400 text-center py-3">No results in this layer</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Initial state */}
      {!searched && (
        <div className="text-center py-12">
          <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Enter a search query to explore the knowledge spiral</p>
        </div>
      )}
    </div>
  );
}
