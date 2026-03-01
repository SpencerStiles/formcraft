'use server';

import { prisma } from './db';
import { revalidatePath } from 'next/cache';
import { buildFormSchema } from './validation';
import { randomBytes } from 'crypto';

// ──────────────────────────────────────────────
// Forms
// ──────────────────────────────────────────────

export async function createForm(data: { title: string; description?: string }) {
  try {
    const suffix = randomBytes(3).toString('hex');
    const slug = data.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      + '-' + suffix;

    const form = await prisma.form.create({
      data: {
        title: data.title,
        description: data.description ?? '',
        slug,
      },
    });

    revalidatePath('/');
    return form;
  } catch (err) {
    console.error('[createForm]', err);
    throw new Error(err instanceof Error ? err.message : 'Operation failed');
  }
}

export async function updateForm(
  id: string,
  data: {
    title?: string;
    description?: string;
    published?: boolean;
    submitLabel?: string;
    successMsg?: string;
  },
) {
  try {
    const form = await prisma.form.update({
      where: { id },
      data,
    });
    revalidatePath('/');
    revalidatePath(`/forms/${form.slug}`);
    revalidatePath(`/forms/${form.slug}/edit`);
    return form;
  } catch (err) {
    console.error('[updateForm]', err);
    throw new Error(err instanceof Error ? err.message : 'Operation failed');
  }
}

export async function deleteForm(id: string) {
  try {
    await prisma.form.delete({ where: { id } });
    revalidatePath('/');
  } catch (err) {
    console.error('[deleteForm]', err);
    throw new Error(err instanceof Error ? err.message : 'Operation failed');
  }
}

export async function getForm(slug: string) {
  try {
    return prisma.form.findUnique({
      where: { slug },
      include: {
        fields: { orderBy: { order: 'asc' } },
        _count: { select: { submissions: true } },
      },
    });
  } catch (err) {
    console.error('[getForm]', err);
    throw new Error(err instanceof Error ? err.message : 'Operation failed');
  }
}

export async function listForms() {
  try {
    return prisma.form.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: { select: { submissions: true, fields: true } },
      },
    });
  } catch (err) {
    console.error('[listForms]', err);
    throw new Error(err instanceof Error ? err.message : 'Operation failed');
  }
}

// ──────────────────────────────────────────────
// Fields
// ──────────────────────────────────────────────

export async function addField(data: {
  formId: string;
  type: string;
  label: string;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  options?: string[];
}) {
  try {
    const maxOrder = await prisma.field.aggregate({
      where: { formId: data.formId },
      _max: { order: true },
    });

    const field = await prisma.field.create({
      data: {
        formId: data.formId,
        type: data.type,
        label: data.label,
        placeholder: data.placeholder ?? '',
        helpText: data.helpText ?? '',
        required: data.required ?? false,
        options: data.options ? JSON.stringify(data.options) : '',
        order: (maxOrder._max.order ?? -1) + 1,
      },
    });

    revalidatePath('/');
    return field;
  } catch (err) {
    console.error('[addField]', err);
    throw new Error(err instanceof Error ? err.message : 'Operation failed');
  }
}

export async function updateField(
  id: string,
  data: {
    label?: string;
    placeholder?: string;
    helpText?: string;
    required?: boolean;
    options?: string[];
    order?: number;
  },
) {
  try {
    const field = await prisma.field.update({
      where: { id },
      data: {
        label: data.label,
        placeholder: data.placeholder,
        helpText: data.helpText,
        required: data.required,
        options: data.options ? JSON.stringify(data.options) : undefined,
        order: data.order,
      },
    });

    revalidatePath('/');
    return field;
  } catch (err) {
    console.error('[updateField]', err);
    throw new Error(err instanceof Error ? err.message : 'Operation failed');
  }
}

export async function deleteField(id: string) {
  try {
    await prisma.field.delete({ where: { id } });
    revalidatePath('/');
  } catch (err) {
    console.error('[deleteField]', err);
    throw new Error(err instanceof Error ? err.message : 'Operation failed');
  }
}

// ──────────────────────────────────────────────
// Submissions
// ──────────────────────────────────────────────

export async function submitForm(data: {
  formId: string;
  answers: Record<string, string>;
}) {
  try {
    const formRecord = await prisma.form.findUnique({
      where: { id: data.formId },
      include: { fields: { orderBy: { order: 'asc' } } },
    });

    if (!formRecord) {
      return { error: { _form: ['Form not found'] } };
    }

    const schema = buildFormSchema(
      formRecord.fields.map((f) => ({
        id: f.id,
        type: f.type,
        label: f.label,
        required: f.required,
        validation: f.validation,
      })),
    );

    const parsed = schema.safeParse(data.answers);
    if (!parsed.success) {
      return { error: parsed.error.flatten().fieldErrors };
    }

    const submission = await prisma.submission.create({
      data: {
        formId: data.formId,
        answers: {
          create: Object.entries(data.answers).map(([fieldId, value]) => ({
            fieldId,
            value: String(value),
          })),
        },
      },
      include: { answers: true },
    });

    revalidatePath('/');
    return submission;
  } catch (err) {
    console.error('[submitForm]', err);
    throw new Error(err instanceof Error ? err.message : 'Operation failed');
  }
}

export async function getSubmissions(formId: string) {
  try {
    return prisma.submission.findMany({
      where: { formId },
      orderBy: { createdAt: 'desc' },
      include: {
        answers: {
          include: { field: true },
        },
      },
    });
  } catch (err) {
    console.error('[getSubmissions]', err);
    throw new Error(err instanceof Error ? err.message : 'Operation failed');
  }
}

export async function getSubmission(id: string) {
  try {
    return prisma.submission.findUnique({
      where: { id },
      include: {
        form: true,
        answers: {
          include: { field: true },
        },
      },
    });
  } catch (err) {
    console.error('[getSubmission]', err);
    throw new Error(err instanceof Error ? err.message : 'Operation failed');
  }
}

export async function deleteSubmission(id: string) {
  try {
    await prisma.submission.delete({ where: { id } });
    revalidatePath('/');
  } catch (err) {
    console.error('[deleteSubmission]', err);
    throw new Error(err instanceof Error ? err.message : 'Operation failed');
  }
}

// ──────────────────────────────────────────────
// Stats
// ──────────────────────────────────────────────

export async function getStats() {
  try {
    const [formCount, fieldCount, submissionCount] = await Promise.all([
      prisma.form.count(),
      prisma.field.count(),
      prisma.submission.count(),
    ]);

    return { formCount, fieldCount, submissionCount };
  } catch (err) {
    console.error('[getStats]', err);
    throw new Error(err instanceof Error ? err.message : 'Operation failed');
  }
}
