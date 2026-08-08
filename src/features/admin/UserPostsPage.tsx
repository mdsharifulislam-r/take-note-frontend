import { useState } from 'react';
import { useGetUsersQuery } from '@/features/users/usersApi';
import { useGetUserPostsQuery } from '@/features/admin/adminApi';
import { formatDate, getApiErrorMessage, roleLabel } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Spinner';
import { Alert, EmptyState } from '@/components/ui/Alert';

export function UserPostsPage() {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [search, setSearch] = useState('');
  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery({ page: 1, limit: 100 });
  const {
    data: postsData,
    isLoading: postsLoading,
    isError,
    error,
  } = useGetUserPostsQuery(selectedUserId, { skip: !selectedUserId });

  const users = usersData?.data ?? [];
  const filteredUsers = search
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()),
      )
    : users;

  const userWithPosts = postsData?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Posts</h1>
        <p className="text-sm text-gray-500">View posts by a specific user</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Select User</CardTitle>
          </CardHeader>
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-3"
          />
          {usersLoading ? (
            <PageLoader />
          ) : (
            <ul className="max-h-96 space-y-1 overflow-y-auto">
              {filteredUsers.map((user) => (
                <li key={user._id}>
                  <button
                    type="button"
                    onClick={() => setSelectedUserId(user._id)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      selectedUserId === user._id
                        ? 'bg-primary-50 text-primary-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="lg:col-span-2">
          {!selectedUserId && (
            <EmptyState
              title="Select a user"
              description="Choose a user from the list to view their posts"
            />
          )}

          {selectedUserId && postsLoading && <PageLoader />}
          {selectedUserId && isError && (
            <Alert variant="error">{getApiErrorMessage(error)}</Alert>
          )}

          {selectedUserId && userWithPosts && (
            <div className="space-y-4">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{userWithPosts.name}</h2>
                    <p className="text-sm text-gray-500">{userWithPosts.email}</p>
                  </div>
                  <Badge role={userWithPosts.role}>{roleLabel(userWithPosts.role)}</Badge>
                </div>
                {userWithPosts.interests?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {userWithPosts.interests.map((interest) => (
                      <Badge key={interest} variant="default">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>

              {userWithPosts.posts.length === 0 ? (
                <EmptyState title="No posts" description="This user hasn't created any posts" />
              ) : (
                userWithPosts.posts.map((post) => (
                  <Card key={post._id}>
                    <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                    <p className="mt-1 text-xs text-gray-400">{formatDate(post.createdAt)}</p>
                    <p className="mt-3 whitespace-pre-wrap text-gray-700">{post.content}</p>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
