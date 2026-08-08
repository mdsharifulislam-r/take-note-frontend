import { FileText, Users, Tags, BookOpen } from 'lucide-react';
import { useGetUsersQuery } from '@/features/users/usersApi';
import { useGetAllNotesQuery } from '@/features/notes/notesApi';
import { useGetUsersByInterestsQuery } from '@/features/admin/adminApi';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { getApiErrorMessage } from '@/lib/utils';

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {description && <p className="mt-1 text-xs text-gray-400">{description}</p>}
        </div>
        <div className="rounded-lg bg-primary-50 p-3">
          <Icon className="h-6 w-6 text-primary-600" />
        </div>
      </div>
    </Card>
  );
}

export function AdminDashboardPage() {
  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
    error: usersErr,
  } = useGetUsersQuery({ page: 1, limit: 1 });
  const {
    data: notesData,
    isLoading: notesLoading,
    isError: notesError,
    error: notesErr,
  } = useGetAllNotesQuery({ page: 1, limit: 1 });
  const {
    data: interestsData,
    isLoading: interestsLoading,
    isError: interestsError,
    error: interestsErr,
  } = useGetUsersByInterestsQuery();

  const isLoading = usersLoading || notesLoading || interestsLoading;
  const isError = usersError || notesError || interestsError;

  if (isLoading) return <PageLoader />;
  if (isError) {
    return (
      <Alert variant="error">
        {getApiErrorMessage(usersErr || notesErr || interestsErr)}
      </Alert>
    );
  }

  const totalUsers = usersData?.pagination?.total ?? 0;
  const totalNotes = notesData?.pagination?.total ?? 0;
  const interestGroups = interestsData?.data?.length ?? 0;
  const totalInterestUsers =
    interestsData?.data?.reduce((sum, g) => sum + g.count, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of your Note Taker platform</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={totalUsers} icon={Users} />
        <StatCard title="Total Notes" value={totalNotes} icon={FileText} />
        <StatCard
          title="Interest Groups"
          value={interestGroups}
          icon={Tags}
          description="Unique interest categories"
        />
        <StatCard
          title="Interest Matches"
          value={totalInterestUsers}
          icon={BookOpen}
          description="Users across all interests"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="/admin/users"
            className="rounded-lg border border-gray-200 p-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Manage Users
          </a>
          <a
            href="/admin/notes"
            className="rounded-lg border border-gray-200 p-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View All Notes
          </a>
          <a
            href="/admin/interests"
            className="rounded-lg border border-gray-200 p-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Users by Interests
          </a>
          <a
            href="/admin/user-posts"
            className="rounded-lg border border-gray-200 p-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            User Posts
          </a>
        </div>
      </Card>
    </div>
  );
}
