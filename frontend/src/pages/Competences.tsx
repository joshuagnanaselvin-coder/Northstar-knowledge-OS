import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import {
  Zap, Settings, Cpu, Headphones, Wrench, CheckCircle, Briefcase,
  Users, ChevronRight
} from 'lucide-react';
import type { Competence } from '../types';

const ICON_MAP: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-6 h-6" />,
  Settings: <Settings className="w-6 h-6" />,
  Cpu: <Cpu className="w-6 h-6" />,
  Headphones: <Headphones className="w-6 h-6" />,
  Wrench: <Wrench className="w-6 h-6" />,
  CheckCircle: <CheckCircle className="w-6 h-6" />,
  Briefcase: <Briefcase className="w-6 h-6" />,
};

export default function Competences() {
  const [competences, setCompetences] = useState<Competence[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(api('/api/competences'))
      .then(r => r.json())
      .then(data => { setCompetences(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <div key={i} className="h-48 bg-slate-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Competence Spaces</h1>
        <p className="text-slate-500 mt-1">
          Knowledge organized by domain. Each space is governed by a Competence Leader.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {competences.map(c => (
          <div
            key={c.id}
            onClick={() => navigate(`/competences/${c.id}`)}
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-primary-200 transition-all cursor-pointer group"
          >
            <div className="p-6">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: (c.color || '#0ea5e9') + '15', color: c.color || '#0ea5e9' }}
              >
                {ICON_MAP[c.icon || 'Zap']}
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{c.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4">{c.description}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{c.asset_count} assets</span>
                <span className="text-slate-400">{c.member_count} members</span>
              </div>
              {c.leader && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-medium text-slate-500">
                    {c.leader.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-xs text-slate-500">{c.leader.name}</span>
                  <span className="text-[10px] text-slate-400 ml-auto">Leader</span>
                </div>
              )}
            </div>
            <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-primary-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                View details
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary-500 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
