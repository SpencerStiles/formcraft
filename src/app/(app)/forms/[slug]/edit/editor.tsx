'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addField, updateField, deleteField, updateForm } from '@/lib/actions';
import { FIELD_TYPES, hasOptions, getFieldTypeLabel } from '@/lib/field-types';

interface FieldData {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  helpText: string;
  required: boolean;
  options: string;
  order: number;
}

interface Props {
  formId: string;
  formSlug: string;
  initialFields: FieldData[];
  published: boolean;
}

export default function FormEditor({ formId, formSlug, initialFields, published }: Props) {
  const router = useRouter();
  const [fields, setFields] = useState<FieldData[]>(initialFields);
  const [isPublished, setIsPublished] = useState(published);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // New field state
  const [newType, setNewType] = useState('text');
  const [newLabel, setNewLabel] = useState('');
  const [newPlaceholder, setNewPlaceholder] = useState('');
  const [newRequired, setNewRequired] = useState(false);
  const [newOptions, setNewOptions] = useState('');

  async function handleAddField() {
    if (!newLabel.trim()) return;
    const opts = hasOptions(newType)
      ? newOptions.split('\n').map((o) => o.trim()).filter(Boolean)
      : undefined;

    const field = await addField({
      formId,
      type: newType,
      label: newLabel,
      placeholder: newPlaceholder,
      required: newRequired,
      options: opts,
    });

    setFields([...fields, field as unknown as FieldData]);
    setNewType('text');
    setNewLabel('');
    setNewPlaceholder('');
    setNewRequired(false);
    setNewOptions('');
    setAdding(false);
  }

  async function handleDeleteField(id: string) {
    await deleteField(id);
    setFields(fields.filter((f) => f.id !== id));
  }

  async function handleToggleRequired(id: string, current: boolean) {
    await updateField(id, { required: !current });
    setFields(fields.map((f) => (f.id === id ? { ...f, required: !current } : f)));
  }

  async function handlePublishToggle() {
    await updateForm(formId, { published: !isPublished });
    setIsPublished(!isPublished);
  }

  return (
    <div className="space-y-4">
      {/* Publish bar */}
      <div className="flex items-center justify-between rounded-lg border bg-white p-4">
        <div className="flex items-center gap-3">
          <span
            className={`h-2.5 w-2.5 rounded-full ${isPublished ? 'bg-green-500' : 'bg-gray-300'}`}
          />
          <span className="text-sm font-medium text-gray-700">
            {isPublished ? 'Published' : 'Draft'}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePublishToggle}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium ${
              isPublished
                ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isPublished ? 'Unpublish' : 'Publish'}
          </button>
          {isPublished && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/forms/${formSlug}`);
              }}
              className="rounded-lg border px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Copy Link
            </button>
          )}
        </div>
      </div>

      {/* Fields */}
      <div className="rounded-lg border bg-white">
        <div className="border-b px-4 py-3">
          <h2 className="font-semibold text-gray-900">Fields ({fields.length})</h2>
        </div>

        {fields.length === 0 && !adding ? (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500">No fields yet. Add your first field.</p>
          </div>
        ) : (
          <div className="divide-y">
            {fields.map((field, idx) => (
              <div key={field.id} className="flex items-center gap-3 px-4 py-3">
                <span className="w-6 text-center text-xs text-gray-400">{idx + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{field.label}</span>
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                      {getFieldTypeLabel(field.type)}
                    </span>
                    {field.required && (
                      <span className="text-xs text-red-500">Required</span>
                    )}
                  </div>
                  {field.placeholder && (
                    <p className="text-xs text-gray-400">{field.placeholder}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleToggleRequired(field.id, field.required)}
                    className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
                  >
                    {field.required ? 'Optional' : 'Required'}
                  </button>
                  <button
                    onClick={() => handleDeleteField(field.id)}
                    className="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add field form */}
        {adding ? (
          <div className="border-t p-4 space-y-3 bg-gray-50">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500">Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="mt-1 block w-full rounded-lg border px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  {FIELD_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">Label</label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g., Full Name"
                  className="mt-1 block w-full rounded-lg border px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Placeholder</label>
              <input
                type="text"
                value={newPlaceholder}
                onChange={(e) => setNewPlaceholder(e.target.value)}
                placeholder="Optional placeholder text"
                className="mt-1 block w-full rounded-lg border px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            {hasOptions(newType) && (
              <div>
                <label className="block text-xs font-medium text-gray-500">
                  Options (one per line)
                </label>
                <textarea
                  value={newOptions}
                  onChange={(e) => setNewOptions(e.target.value)}
                  rows={3}
                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                  className="mt-1 block w-full rounded-lg border px-3 py-1.5 font-mono text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            )}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={newRequired}
                  onChange={(e) => setNewRequired(e.target.checked)}
                  className="rounded"
                />
                Required
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddField}
                disabled={!newLabel.trim()}
                className="rounded-lg bg-brand-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
              >
                Add Field
              </button>
              <button
                onClick={() => setAdding(false)}
                className="rounded-lg border px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="border-t p-4">
            <button
              onClick={() => setAdding(true)}
              className="w-full rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 hover:border-brand-400 hover:text-brand-600"
            >
              + Add Field
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
