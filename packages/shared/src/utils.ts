export const generateId = (): string => {
  return crypto.randomUUID();
};

export const formatDate = (date: Date): string => {
  return date.toISOString();
};

export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeSelector = (selector: string): string => {
  return selector.trim().replace(/[^\w\s\-\.\#\[\]\:]/g, '');
};
