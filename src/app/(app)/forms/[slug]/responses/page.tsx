import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getForm, getSubmissions } from '@/lib/actions';

export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
}

export default async function ResponsesPage({ params }: Props) {
  const form = await getForm(params.slug);
  if (!form) notFound();

  const submissions = await getSubmissions(form.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Responses</h1>
          <p className="mt-1 text-sm text-gray-500">
            {form.title} &mdash; {submissions.length} response{submissions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href={`/forms/${form.slug}/edit`}
          className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back to Editor
        </Link>
      </div>

      {submissions.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-700">No responses yet</h3>
          <p className="mt-2 text-sm text-gray-500">Share your form to start collecting responses.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-500">#</th>
                {form.fields.map((field) => (
                  <th key={field.id} className="px-4 py-3 font-medium text-gray-500">
                    {field.label}
                  </th>
                ))}
                <th className="px-4 py-3 font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {submissions.map((sub, idx) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                  {form.fields.map((field) => {
                    const answer = sub.answers.find((a) => a.fieldId === field.id);
                    return (
                      <td key={field.id} className="max-w-[200px] truncate px-4 py-3 text-gray-700">
                        {answer?.value || <span className="text-gray-300">&mdash;</span>}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(sub.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
