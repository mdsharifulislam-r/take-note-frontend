import type { ApiErrorResponse, Note, NoteAuthor, UserRole } from '@/types';

const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000';

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function getImageUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/uploads')) return `${UPLOADS_URL}${path}`;
  return path;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isAdmin(role?: UserRole): boolean {
  return role === 'admin' || role === 'super_admin';
}

export function getNoteAuthorName(author: Note['author']): string {
  if (typeof author === 'string') return 'Unknown';
  return author.name;
}

export function getNoteAuthorEmail(author: Note['author']): string | undefined {
  if (typeof author === 'string') return undefined;
  return author.email;
}

export function getNoteAuthorImage(author: Note['author']): string | undefined {
  if (typeof author === 'string') return undefined;
  return getImageUrl(author.profileImage);
}

export function isNoteAuthor(author: Note['author']): author is NoteAuthor {
  return typeof author === 'object' && author !== null && '_id' in author;
}

export function getApiErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = (error as { data: ApiErrorResponse }).data;
    if (data?.message) return data.message;
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: string }).message);
  }
  return 'Something went wrong';
}

export function getApiFieldErrors(error: unknown): Record<string, string> {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = (error as { data: ApiErrorResponse }).data;
    if (data?.errors) {
      return data.errors.reduce<Record<string, string>>((acc, err) => {
        acc[err.field] = err.message;
        return acc;
      }, {});
    }
  }
  return {};
}

export function roleLabel(role: UserRole): string {
  switch (role) {
    case 'super_admin':
      return 'Super Admin';
    case 'admin':
      return 'Admin';
    default:
      return 'User';
  }
}

export function roleBadgeColor(role: UserRole): string {
  switch (role) {
    case 'super_admin':
      return 'bg-purple-100 text-purple-800';
    case 'admin':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
}
