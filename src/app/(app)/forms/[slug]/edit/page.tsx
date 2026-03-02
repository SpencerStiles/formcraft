import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getForm } from '@/lib/actions';
import FormEditor from './editor';

export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
}

export default async function EditFormPage({ params }: Props) {
  const form = await getForm(params.slug);
  if (!form) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
          {form.description && (
            <p className="mt-1 text-sm text-gray-500">{form.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/forms/${form.slug}`}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Preview
          </Link>
          <Link
            href={`/forms/${form.slug}/responses`}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Responses ({form._count.submissions})
          </Link>
        </div>
      </div>

      <FormEditor
        formId={form.id}
        formSlug={form.slug}
        initialFields={form.fields}
        published={form.published}
      />
    </div>
  );
}
