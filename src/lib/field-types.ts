export const FIELD_TYPES = [
  { id: 'text', label: 'Short Text', icon: 'Type' },
  { id: 'textarea', label: 'Long Text', icon: 'AlignLeft' },
  { id: 'email', label: 'Email', icon: 'Mail' },
  { id: 'number', label: 'Number', icon: 'Hash' },
  { id: 'select', label: 'Dropdown', icon: 'ChevronDown' },
  { id: 'radio', label: 'Radio', icon: 'Circle' },
  { id: 'checkbox', label: 'Checkbox', icon: 'CheckSquare' },
  { id: 'date', label: 'Date', icon: 'Calendar' },
  { id: 'url', label: 'URL', icon: 'Link' },
  { id: 'phone', label: 'Phone', icon: 'Phone' },
] as const;

export type FieldType = (typeof FIELD_TYPES)[number]['id'];

export function hasOptions(type: string): boolean {
  return ['select', 'radio', 'checkbox'].includes(type);
}

export function getFieldTypeLabel(type: string): string {
  return FIELD_TYPES.find((t) => t.id === type)?.label ?? type;
}
