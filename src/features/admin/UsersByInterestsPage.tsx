import { useGetUsersByInterestsQuery } from '@/features/admin/adminApi';
import { PageLoader } from '@/components/ui/Spinner';
import { Alert, EmptyState } from '@/components/ui/Alert';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getApiErrorMessage } from '@/lib/utils';

export function UsersByInterestsPage() {
  const { data, isLoading, isError, error } = useGetUsersByInterestsQuery();

  if (isLoading) return <PageLoader />;
  if (isError) return <Alert variant="error">{getApiErrorMessage(error)}</Alert>;

  const groups = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users by Interests</h1>
        <p className="text-sm text-gray-500">Users grouped by their interests</p>
      </div>

      {groups.length === 0 ? (
        <EmptyState
          title="No interest groups"
          description="Users haven't added any interests yet"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Card key={group._id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="capitalize">{group._id}</CardTitle>
                  <Badge variant="default">{group.count} users</Badge>
                </div>
              </CardHeader>
              <ul className="space-y-2">
                {group.users.map((user) => (
                  <li
                    key={user._id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
                  >
                    <span className="font-medium text-gray-900">{user.name}</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
