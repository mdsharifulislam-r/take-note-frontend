import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  useCreateNoteMutation,
  useGetNoteByIdQuery,
  useUpdateNoteMutation,
} from '@/features/notes/notesApi';
import { noteSchema, type NoteFormData } from '@/lib/schemas';
import { useApiFormErrors } from '@/lib/formErrors';
import { getApiErrorMessage, getImageUrl } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { FileInput } from '@/components/ui/FileInput';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { toast } from 'sonner';
export function NoteFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: noteData, isLoading: isLoadingNote } = useGetNoteByIdQuery(id!, {
    skip: !isEdit,
  });
  const [createNote, { isLoading: isCreating, error: createError }] = useCreateNoteMutation();
  const [updateNote, { isLoading: isUpdating, error: updateError }] = useUpdateNoteMutation();

  const error = createError || updateError;
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
  });

  useApiFormErrors(error, setError);

  useEffect(() => {
    if (noteData?.data) {
      reset({
        title: noteData.data.title,
        content: noteData.data.content,
      });
    }
  }, [noteData, reset]);

  const onSubmit = async (formData: NoteFormData) => {
    const body = new FormData();
    body.append('title', formData.title);
    body.append('content', formData.content);
    if (imageFile) body.append('image', imageFile);

    if (isEdit && id) {
      const result = await updateNote({ id, body });
      if (result.data) {
        toast.success(result.data.message || 'Note updated');
        navigate(`/notes/${id}`);
      }
    } else {
      const result = await createNote(body);
      if (result.data) {
        toast.success(result.data.message || 'Note created');
        navigate(`/notes/${result.data.data._id}`);
      }
    }
  };

  if (isEdit && isLoadingNote) return <PageLoader />;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        to={isEdit ? `/notes/${id}` : '/notes'}
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit Note' : 'Create Note'}</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Title"
            placeholder="Note title"
            error={errors.title?.message}
            {...register('title')}
          />
          <Textarea
            label="Content"
            placeholder="Write your note..."
            rows={8}
            error={errors.content?.message}
            {...register('content')}
          />
          <FileInput
            label="Image (optional)"
            previewUrl={noteData?.data?.image ? getImageUrl(noteData.data.image) : undefined}
            onChange={setImageFile}
          />

          {error && <Alert variant="error">{getApiErrorMessage(error)}</Alert>}

          <div className="flex gap-3">
            <Button type="submit" isLoading={isLoading}>
              {isEdit ? 'Save Changes' : 'Create Note'}
            </Button>
            <Link to={isEdit ? `/notes/${id}` : '/notes'}>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
