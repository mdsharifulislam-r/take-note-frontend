import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useGetMyNotesQuery } from '@/features/notes/notesApi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { Alert, EmptyState } from '@/components/ui/Alert';
import { formatDate, getApiErrorMessage, getImageUrl } from '@/lib/utils';

export function MyNotesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading, isError, error } = useGetMyNotesQuery({ page, limit: 10 });

  const notes = data?.data ?? [];
  const filtered = search
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.content.toLowerCase().includes(search.toLowerCase()),
      )
    : notes;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
          <p className="text-sm text-gray-500">Manage your personal notes</p>
        </div>
        <Link to="/notes/new">
          <Button>
            <Plus className="h-4 w-4" />
            New Note
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && <Alert variant="error">{getApiErrorMessage(error)}</Alert>}

      {!isLoading && !isError && filtered.length === 0 && (
        <EmptyState
          title={search ? 'No matching notes' : 'No notes yet'}
          description={
            search
              ? 'Try a different search term'
              : 'Create your first note to get started'
          }
          action={
            !search && (
              <Link to="/notes/new">
                <Button>Create Note</Button>
              </Link>
            )
          }
        />
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((note) => (
            <Link
              key={note._id}
              to={`/notes/${note._id}`}
              className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              {note.image && (
                <img
                  src={getImageUrl(note.image)}
                  alt=""
                  className="mb-3 h-32 w-full rounded-lg object-cover"
                />
              )}
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">
                {note.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-gray-500">{note.content}</p>
              <p className="mt-3 text-xs text-gray-400">{formatDate(note.updatedAt)}</p>
            </Link>
          ))}
        </div>
      )}

      {data?.pagination && !search && (
        <Pagination pagination={data.pagination} onPageChange={setPage} />
      )}
    </div>
  );
}
