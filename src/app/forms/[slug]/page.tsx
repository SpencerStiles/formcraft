'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getForm, submitForm } from '@/lib/actions';
import { validateField } from '@/lib/validation';

interface FieldData {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  helpText: string;
  required: boolean;
  options: string;
  validation: string;
  defaultValue: string;
  order: number;
}

interface PublishedForm {
  id: string;
  title: string;
  description: string;
  slug: string;
  published: boolean;
  submitLabel: string;
  successMsg: string;
  fields: FieldData[];
}

function parseOpts(raw: string): string[] {
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

export default function FormFillPage() {
  const params = useParams();
  const [form, setForm] = useState<PublishedForm | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const f = await getForm(params.slug as string);
      if (f && f.published) {
        setForm(f as PublishedForm);
        const init: Record<string, string> = {};
        f.fields.forEach((field) => { init[field.id] = ''; });
        setAnswers(init);
      }
      setLoading(false);
    }
    load();
  }, [params.slug]);

  function handleChange(fieldId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
    setErrors((prev) => { const c = { ...prev }; delete c[fieldId]; return c; });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    const newErrors: Record<string, string> = {};
    for (const field of form.fields) {
      const err = validateField(answers[field.id] ?? '', field);
      if (err) newErrors[field.id] = err;
    }
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setSubmitting(true);
    try {
      await submitForm({ formId: form.id, answers });
      setSubmitted(true);
    } catch { setSubmitting(false); }
  }

  if (loading) return <div className="py-20 text-center text-gray-500">Loading...</div>;
  if (!form) return (
    <div className="py-20 text-center">
      <h2 className="text-lg font-semibold text-gray-700">Form not found</h2>
      <p className="mt-2 text-sm text-gray-500">This form doesn&apos;t exist or isn&apos;t published.</p>
    </div>
  );
  if (submitted) return (
    <div className="mx-auto max-w-lg py-20 text-center">
      <h2 className="text-xl font-bold text-gray-900">Submitted!</h2>
      <p className="mt-2 text-gray-600">{form.successMsg}</p>
    </div>
  );

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
        {form.description && <p className="mt-1 text-sm text-gray-500">{form.description}</p>}
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        {form.fields.map((field) => {
          const opts = parseOpts(field.options);
          return (
            <div key={field.id}>
              <label className="block text-sm font-medium text-gray-700">
                {field.label}{field.required && <span className="ml-0.5 text-red-500">*</span>}
              </label>
              {field.helpText && <p className="mt-0.5 text-xs text-gray-400">{field.helpText}</p>}

              {field.type === 'textarea' ? (
                <textarea value={answers[field.id] ?? ''} onChange={(e) => handleChange(field.id, e.target.value)} placeholder={field.placeholder} rows={4} className="mt-1 block w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" />
              ) : field.type === 'select' ? (
                <select value={answers[field.id] ?? ''} onChange={(e) => handleChange(field.id, e.target.value)} className="mt-1 block w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500">
                  <option value="">Select...</option>
                  {opts.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : field.type === 'radio' ? (
                <div className="mt-1 space-y-1">
                  {opts.map((o) => (
                    <label key={o} className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="radio" name={field.id} value={o} checked={answers[field.id] === o} onChange={() => handleChange(field.id, o)} />
                      {o}
                    </label>
                  ))}
                </div>
              ) : field.type === 'checkbox' ? (
                <div className="mt-1 space-y-1">
                  {opts.map((o) => {
                    const sel = (answers[field.id] ?? '').split(',').filter(Boolean);
                    return (
                      <label key={o} className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" checked={sel.includes(o)} onChange={() => {
                          const next = sel.includes(o) ? sel.filter((s) => s !== o) : [...sel, o];
                          handleChange(field.id, next.join(','));
                        }} />
                        {o}
                      </label>
                    );
                  })}
                </div>
              ) : (
                <input type={field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'url' ? 'url' : field.type === 'phone' ? 'tel' : 'text'} value={answers[field.id] ?? ''} onChange={(e) => handleChange(field.id, e.target.value)} placeholder={field.placeholder} className="mt-1 block w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" />
              )}

              {errors[field.id] && <p className="mt-1 text-xs text-red-500">{errors[field.id]}</p>}
            </div>
          );
        })}
        <button type="submit" disabled={submitting} className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50">
          {submitting ? 'Submitting...' : form.submitLabel}
        </button>
      </form>
    </div>
  );
}
