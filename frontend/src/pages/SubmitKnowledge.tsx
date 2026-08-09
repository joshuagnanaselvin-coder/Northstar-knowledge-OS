import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Tag, FileText, Users, Shield, Calendar, ArrowLeft } from 'lucide-react';
import { api } from '../api';

const KNOWLEDGE_TYPES = [
  'Troubleshooting Case',
  'Lesson Learned',
  'Best Practice',
  'Training Material',
  'Standard Procedure',
  'Template',
  'Case Study',
  'Guide',
  'Checklist',
  'Reference',
  'Manual',
  'Framework',
] as const;

const COMPETENCES = [
  'Electrical Systems',
  'Mechanical Design',
  'Automation',
  'Product Support',
  'Field Service',
  'Quality',
  'Project Management',
] as const;

const CONFIDENTIALITY_LEVELS = [
  { value: 'L0', label: 'L0 - Public', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { value: 'L1', label: 'L1 - Competence Only', color: 'bg-sky-100 text-sky-700 border-sky-200' },
  { value: 'L2', label: 'L2 - Cross-Functional Restricted', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'L3', label: 'L3 - Leadership Restricted', color: 'bg-rose-100 text-rose-700 border-rose-200' },
] as const;

const TAG_COLORS = [
  'bg-sky-100 text-sky-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-violet-100 text-violet-700',
  'bg-teal-100 text-teal-700',
] as const;

export default function SubmitKnowledge() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    knowledgeType: '',
    competence: '',
    confidentialityLevel: 'L0',
    tags: '',
    sourceReference: '',
    relatedDocuments: '',
    reviewDueDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (submitError) setSubmitError('');
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.summary.trim()) {
      newErrors.summary = 'Summary is required';
    }
    if (!formData.knowledgeType) {
      newErrors.knowledgeType = 'Knowledge type is required';
    }
    if (!formData.competence) {
      newErrors.competence = 'Competence is required';
    }
    if (!formData.reviewDueDate) {
      newErrors.reviewDueDate = 'Review due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const response = await fetch(api('/api/assets'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Submission failed (${response.status})`
        );
      }

      setSubmitSuccess(true);

      setTimeout(() => {
        navigate('/library');
      }, 1800);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.'
      );
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    'w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all placeholder:text-slate-400';
  const selectClasses = `${inputClasses} appearance-none bg-white cursor-pointer`;
  const errorClasses = 'border-red-300 focus:ring-red-500 focus:border-red-500';
  const labelClasses = 'text-sm font-medium text-slate-700 mb-1.5 block';

  const renderSelect = (
    name: string,
    value: string,
    options: readonly string[],
    label: string,
    icon: React.ReactNode
  ) => (
    <div>
      <label className={labelClasses}>{label}</label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={handleChange}
          className={`${selectClasses} ${errors[name] ? errorClasses : ''}`}
        >
          <option value="">Select {label.toLowerCase()}...</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name]}</p>}
    </div>
  );

  const parsedTags = formData.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <button
          onClick={() => navigate('/library')}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Library
        </button>

        {/* Page Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex-shrink-0 w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-sky-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Submit New Knowledge
            </h1>
            <p className="text-slate-500 mt-1">
              Share your expertise with the organization
            </p>
          </div>
        </div>

        {/* Success Banner */}
        {submitSuccess && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg flex items-center gap-3 animate-pulse">
            <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium">Knowledge submitted successfully!</p>
              <p className="text-xs text-emerald-600 mt-0.5">Redirecting to the knowledge library...</p>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {submitError && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-lg flex items-center gap-3">
            <svg className="w-5 h-5 text-rose-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Core Information */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              Core Information
            </h2>
            <div className="space-y-5">
              <div>
                <label className={labelClasses}>Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter a descriptive title for this knowledge asset"
                  className={`${inputClasses} ${errors.title ? errorClasses : ''}`}
                />
                {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
              </div>

              <div>
                <label className={labelClasses}>Summary / Description <span className="text-red-500">*</span></label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  placeholder="Provide a detailed summary of the knowledge, including key insights, outcomes, or lessons..."
                  rows={4}
                  className={`${inputClasses.replace('py-2.5', 'py-2.5')} resize-y ${errors.summary ? errorClasses : ''}`}
                />
                {errors.summary && <p className="mt-1 text-xs text-red-600">{errors.summary}</p>}
                <p className="mt-1 text-xs text-slate-400 text-right">
                  {formData.summary.length} characters
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {renderSelect(
                  'knowledgeType',
                  formData.knowledgeType,
                  KNOWLEDGE_TYPES,
                  'Knowledge Type',
                  <FileText className="w-4 h-4" />
                )}
                {renderSelect(
                  'competence',
                  formData.competence,
                  COMPETENCES,
                  'Competence',
                  <Users className="w-4 h-4" />
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Classification */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-400" />
              Classification & Access
            </h2>
            <div className="space-y-5">
              <div>
                <label className={labelClasses}>Confidentiality Level <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    name="confidentialityLevel"
                    value={formData.confidentialityLevel}
                    onChange={handleChange}
                    className={selectClasses}
                  >
                    {CONFIDENTIALITY_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {CONFIDENTIALITY_LEVELS.map((level) => (
                    <span
                      key={level.value}
                      className={`text-xs px-2.5 py-1 rounded-full border ${
                        formData.confidentialityLevel === level.value
                          ? level.color
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      {level.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Metadata */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4 text-slate-400" />
              Metadata & References
            </h2>
            <div className="space-y-5">
              <div>
                <label className={labelClasses}>Tags</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="e.g. PLC, SCADA, Maintenance (comma-separated)"
                    className={`${inputClasses} pl-9`}
                  />
                </div>
                {parsedTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {parsedTags.map((tag, index) => (
                      <span
                        key={index}
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          TAG_COLORS[index % TAG_COLORS.length]
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className={labelClasses}>Source Reference</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    name="sourceReference"
                    value={formData.sourceReference}
                    onChange={handleChange}
                    placeholder="e.g. Ticket #1234, Incident Report, Vendor Documentation"
                    className={`${inputClasses} pl-9`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClasses}>Related Documents</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <input
                    type="text"
                    name="relatedDocuments"
                    value={formData.relatedDocuments}
                    onChange={handleChange}
                    placeholder="Asset IDs separated by commas (optional)"
                    className={`${inputClasses} pl-9`}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Link to existing assets in the knowledge base by their asset ID
                </p>
              </div>

              <div>
                <label className={labelClasses}>
                  Review Due Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    name="reviewDueDate"
                    value={formData.reviewDueDate}
                    onChange={handleChange}
                    className={`${inputClasses} pl-9 ${errors.reviewDueDate ? errorClasses : ''}`}
                  />
                </div>
                {errors.reviewDueDate && (
                  <p className="mt-1 text-xs text-red-600">{errors.reviewDueDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate('/library')}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-6 py-2.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || submitSuccess}
              className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Submitting...
                </>
              ) : submitSuccess ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Submitted
                </>
              ) : (
                'Submit Knowledge'
              )}
            </button>
          </div>
        </form>

        {/* Footer Note */}
        <p className="text-xs text-slate-400 text-center mt-8">
          Submitted knowledge will be reviewed by your competence lead before publication.
        </p>
      </div>
    </div>
  );
}
