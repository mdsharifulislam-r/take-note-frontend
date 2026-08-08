import { getApiErrorMessage, getApiFieldErrors } from '@/lib/utils';
import { useEffect } from 'react';
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { toast } from 'sonner';

export function useApiFormErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
) {
  useEffect(() => {
    if (!error) return;

    const fieldErrors = getApiFieldErrors(error);
    Object.entries(fieldErrors).forEach(([field, message]) => {
      setError(field as Path<T>, { message });
    });

    const message = getApiErrorMessage(error);
    if (message && Object.keys(fieldErrors).length === 0) {
      toast.error(message);
    }
  }, [error, setError]);
}

export function showMutationResult(
  result: { data?: { message?: string }; error?: unknown },
  successMessage?: string,
) {
  if (result.data) {
    toast.success(successMessage || result.data.message || 'Success');
    return true;
  }
  if (result.error) {
    toast.error(getApiErrorMessage(result.error));
    return false;
  }
  return false;
}
