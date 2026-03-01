import { z } from 'zod';

interface FieldDef {
  id: string;
  type: string;
  label: string;
  required: boolean;
  validation: string;
}

/**
 * Build a Zod schema from field definitions for server-side validation.
 */
export function buildFormSchema(fields: FieldDef[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    let schema: z.ZodTypeAny;
    const rules = parseValidation(field.validation);

    switch (field.type) {
      case 'email':
        schema = z.string().email('Invalid email');
        break;
      case 'url':
        schema = z.string().url('Invalid URL');
        break;
      case 'number':
        schema = z.coerce.number();
        if (rules.min !== undefined) schema = (schema as z.ZodNumber).min(rules.min);
        if (rules.max !== undefined) schema = (schema as z.ZodNumber).max(rules.max);
        break;
      case 'date':
        schema = z.string().refine(
          (v) => !v || !isNaN(Date.parse(v)),
          'Invalid date',
        );
        break;
      default:
        schema = z.string();
        if (rules.minLength) schema = (schema as z.ZodString).min(rules.minLength);
        if (rules.maxLength) schema = (schema as z.ZodString).max(rules.maxLength);
        if (rules.pattern) schema = (schema as z.ZodString).regex(new RegExp(rules.pattern));
        break;
    }

    if (!field.required) {
      schema = schema.optional().or(z.literal(''));
    }

    shape[field.id] = schema;
  }

  return z.object(shape);
}

interface ValidationRules {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

function parseValidation(json: string): ValidationRules {
  if (!json) return {};
  try {
    return JSON.parse(json) as ValidationRules;
  } catch {
    return {};
  }
}

/**
 * Validate a single value against field rules. Returns error message or null.
 */
export function validateField(
  value: string,
  field: FieldDef,
): string | null {
  if (field.required && !value.trim()) {
    return `${field.label} is required`;
  }
  if (!value.trim()) return null;

  if (field.type === 'email') {
    const emailResult = z.string().email().safeParse(value);
    if (!emailResult.success) return 'Invalid email address';
  }
  if (field.type === 'url') {
    try { new URL(value); } catch { return 'Invalid URL'; }
  }
  if (field.type === 'number' && isNaN(Number(value))) {
    return 'Must be a number';
  }

  return null;
}
