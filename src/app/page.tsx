import Link from 'next/link';
import { listForms, getStats } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [forms, stats] = await Promise.all([listForms(), getStats()]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your forms and responses.</p>
        </div>
        <Link
          href="/forms/new"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          New Form
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Forms', value: stats.formCount },
          { label: 'Fields', value: stats.fieldCount },
          { label: 'Responses', value: stats.submissionCount },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border bg-white p-4">
            <p className="text-xs font-medium text-gray-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Form list */}
      {forms.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-700">No forms yet</h3>
          <p className="mt-2 text-sm text-gray-500">Create your first form to get started.</p>
          <Link
            href="/forms/new"
            className="mt-4 inline-block rounded-lg bg-brand-600 px-6 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Create Form
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {forms.map((form) => (
            <div key={form.id} className="rounded-lg border bg-white p-5 transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <Link href={`/forms/${form.slug}/edit`}>
                    <h2 className="font-semibold text-gray-900 hover:text-brand-600">{form.title}</h2>
                  </Link>
                  {form.description && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-1">{form.description}</p>
                  )}
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    form.published
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {form.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                <span>{form._count.fields} fields</span>
                <span>{form._count.submissions} responses</span>
                <span>{new Date(form.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <Link
                  href={`/forms/${form.slug}/edit`}
                  className="rounded border px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Edit
                </Link>
                <Link
                  href={`/forms/${form.slug}`}
                  className="rounded border px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Preview
                </Link>
                <Link
                  href={`/forms/${form.slug}/responses`}
                  className="rounded border px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Responses
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
