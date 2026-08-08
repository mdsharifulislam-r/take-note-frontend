import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAllNotesQuery } from '@/features/notes/notesApi';
import { Pagination } from '@/components/ui/Pagination';
import { Alert } from '@/components/ui/Alert';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/Alert';
import {
  formatDate,
  getApiErrorMessage,
  getImageUrl,
  getNoteAuthorEmail,
  getNoteAuthorName,
} from '@/lib/utils';

export function AllNotesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useGetAllNotesQuery({ page, limit: 10 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Notes</h1>
        <p className="text-sm text-gray-500">View all notes across the platform</p>
      </div>

      {isError && <Alert variant="error">{getApiErrorMessage(error)}</Alert>}

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Author
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Image
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Updated
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={4} />)}
            {!isLoading && data?.data.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8">
                  <EmptyState title="No notes found" />
                </td>
              </tr>
            )}
            {!isLoading &&
              data?.data.map((note) => (
                <tr key={note._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      to={`/notes/${note._id}`}
                      className="font-medium text-primary-600 hover:text-primary-700"
                    >
                      {note.title}
                    </Link>
                    <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">{note.content}</p>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <p className="font-medium text-gray-900">{getNoteAuthorName(note.author)}</p>
                    <p className="text-xs text-gray-500">{getNoteAuthorEmail(note.author)}</p>
                  </td>
                  <td className="px-4 py-3">
                    {note.image ? (
                      <img
                        src={getImageUrl(note.image)}
                        alt=""
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {formatDate(note.updatedAt)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {data?.pagination && (
        <Pagination pagination={data.pagination} onPageChange={setPage} />
      )}
    </div>
  );
}
