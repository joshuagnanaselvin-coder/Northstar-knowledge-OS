export interface User {
  id: number;
  name: string;
  email: string;
  role: "Community Member" | "Employee" | "Champion" | "Leader" | "Admin";
  competence?: string;
  avatar?: string;
  department?: string;
}

export interface Competence {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  leader_id?: number;
  member_count: number;
  asset_count: number;
  color?: string;
  leader?: User | null;
  assets?: KnowledgeAsset[];
  lessons_learned?: KnowledgeAsset[];
  experts?: User[];
  training?: any[];
}

export interface KnowledgeAsset {
  id: number;
  title: string;
  description?: string;
  asset_type: string;
  confidentiality: string;
  status: string;
  version: string;
  tags?: string;
  owner?: User | null;
  reviewer?: User | null;
  approver?: User | null;
  competence?: Competence | null;
  review_date?: string;
  created_at: string;
  updated_at: string;
  content?: string;
  related_docs?: string;
  workflows?: any[];
}

export interface ApprovalWorkflow {
  id: number;
  asset?: KnowledgeAsset | null;
  current_stage: string;
  submitted_user?: User | null;
  submitted_at: string;
  reviewed_at?: string;
  approved_at?: string;
  comments?: string;
}

export interface KPIs {
  total_assets: number;
  pending_reviews: number;
  overdue_docs: number;
  active_competences: number;
  published_this_month: number;
  active_users: number;
  approval_queue: number;
  avg_review_time: string;
}

export interface SearchLayer {
  layer: string;
  icon: string;
  count: number;
  items: any[];
}

export interface SearchResponse {
  query: string;
  ai_answer: string;
  sources: string[];
  layers: SearchLayer[];
}

export const CONFIDENTIALITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  L0: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  L1: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
  L2: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  L3: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
};

export const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Published: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "Champion Review": { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
  "Leader Approval": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  Submitted: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  Draft: { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" },
  "Review Due": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  Archived: { bg: "bg-slate-50", text: "text-slate-500", border: "border-slate-200" },
};

export const TYPE_ICONS: Record<string, string> = {
  Procedure: "📋",
  "Lesson Learned": "💡",
  "Case Study": "📊",
  Guideline: "📖",
  Guide: "📘",
  Manual: "📕",
  Standard: "📏",
  Framework: "🏗️",
  Template: "📝",
  Report: "📈",
  Checklist: "✅",
};
