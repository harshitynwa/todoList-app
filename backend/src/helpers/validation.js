const ALLOWED_PRIORITIES = ['HIGH', 'MEDIUM', 'LOW'];

export function normalizeText(value) {
  if (value === undefined || value === null) {
    return '';
  }

  return value.toString().trim();
}

export function isNonEmptyText(value) {
  return normalizeText(value).length > 0;
}

export function isValidPriority(value) {
  return ALLOWED_PRIORITIES.includes(value);
}

export function isValidDueDate(value) {
  const normalized = normalizeText(value);
  if (!normalized) {
    return false;
  }

  return !Number.isNaN(Date.parse(normalized));
}

export function isBoolean(value) {
  return typeof value === 'boolean';
}
