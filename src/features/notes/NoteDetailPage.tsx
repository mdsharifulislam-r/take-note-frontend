import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useGetNoteByIdQuery, useDeleteNoteMutation } from '@/features/notes/notesApi';
import { PageLoader } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatDate, getApiErrorMessage, getImageUrl } from '@/lib/utils';
import { toast } from 'sonner';

export function NoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetNoteByIdQuery(id!, { skip: !id });
  const [deleteNote, { isLoading: isDeleting }] = useDeleteNoteMutation();

  const handleDelete = async () => {
    if (!id || !confirm('Are you sure you want to delete this note?')) return;
    const result = await deleteNote(id);
    if (result.data) {
      toast.success(result.data.message || 'Note deleted');
      navigate('/notes');
    } else if (result.error) {
      toast.error(getApiErrorMessage(result.error));
    }
  };

  if (isLoading) return <PageLoader />;
  if (isError) return <Alert variant="error">{getApiErrorMessage(error)}</Alert>;

  const note = data?.data;
  if (!note) return <Alert variant="error">Note not found</Alert>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/notes"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to notes
        </Link>
        <div className="flex gap-2">
          <Link to={`/notes/${id}/edit`}>
            <Button variant="secondary" size="sm">
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button variant="danger" size="sm" isLoading={isDeleting} onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        {note.image && (
          <img
            src={getImageUrl(note.image)}
            alt={note.title}
            className="mb-6 max-h-96 w-full rounded-lg object-cover"
          />
        )}
        <h1 className="text-3xl font-bold text-gray-900">{note.title}</h1>
        <p className="mt-2 text-sm text-gray-500">
          Updated {formatDate(note.updatedAt)}
        </p>
        <div className="mt-6 whitespace-pre-wrap text-gray-700">{note.content}</div>
      </Card>
    </div>
  );
}
