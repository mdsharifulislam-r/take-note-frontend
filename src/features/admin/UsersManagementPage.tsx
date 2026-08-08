import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '@/features/users/usersApi';
import { useAppSelector } from '@/app/hooks';
import { userSchema, updateUserSchema, type UserFormData, type UpdateUserFormData } from '@/lib/schemas';
import { useApiFormErrors } from '@/lib/formErrors';
import { formatDate, getApiErrorMessage, roleLabel } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TagsInput } from '@/components/ui/TagsInput';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { Alert } from '@/components/ui/Alert';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/Alert';
import type { User, UserRole } from '@/types';
import { toast } from 'sonner';

function UserModal({
  user,
  onClose,
  onSuccess,
}: {
  user?: User;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isEdit = Boolean(user);
  const [createUser, { isLoading: isCreating, error: createError }] = useCreateUserMutation();
  const [updateUserApi, { isLoading: isUpdating, error: updateError }] = useUpdateUserMutation();
  const error = createError || updateError;
  const isLoading = isCreating || isUpdating;

  const schema = isEdit ? updateUserSchema : userSchema;

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<UserFormData | UpdateUserFormData>({
    resolver: zodResolver(schema),
    defaultValues: user
      ? {
          name: user.name,
          email: user.email,
          password: '',
          role: user.role,
          interests: user.interests || [],
        }
      : { role: 'user' as UserRole, interests: [] },
  });

  useApiFormErrors(error, setError);

  const onSubmit = async (data: UserFormData | UpdateUserFormData) => {
    if (isEdit && user) {
      const payload: Record<string, unknown> = { id: user._id };
      if (data.name) payload.name = data.name;
      if (data.email) payload.email = data.email;
      if (data.password) payload.password = data.password;
      if (data.role) payload.role = data.role;
      if (data.interests) payload.interests = data.interests;

      const result = await updateUserApi(payload as Parameters<typeof updateUserApi>[0]);
      if (result.data) {
        toast.success(result.data.message || 'User updated');
        onSuccess();
        onClose();
      }
    } else {
      const result = await createUser(data as UserFormData);
      if (result.data) {
        toast.success(result.data.message || 'User created');
        onSuccess();
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">{isEdit ? 'Edit User' : 'Create User'}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <Input label="Name" error={errors.name?.message} {...register('name')} />
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Input
            label={isEdit ? 'New Password' : 'Password'}
            type="password"
            placeholder={isEdit ? 'Leave blank to keep current' : ''}
            error={errors.password?.message}
            {...register('password')}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Role</label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              {...register('role')}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <Controller
            name="interests"
            control={control}
            render={({ field }) => (
              <TagsInput
                label="Interests"
                value={field.value || []}
                onChange={field.onChange}
              />
            )}
          />
          {error && <Alert variant="error">{getApiErrorMessage(error)}</Alert>}
          <div className="flex gap-3">
            <Button type="submit" isLoading={isLoading}>
              {isEdit ? 'Save' : 'Create'}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function UsersManagementPage() {
  const [page, setPage] = useState(1);
  const [modalUser, setModalUser] = useState<User | undefined | null>(null);
  const currentUser = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isError, error, refetch } = useGetUsersQuery({ page, limit: 10 });
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleDelete = async (user: User) => {
    if (user._id === currentUser?.id) {
      toast.error('You cannot delete your own account');
      return;
    }
    if (!confirm(`Delete user ${user.name}?`)) return;
    const result = await deleteUser(user._id);
    if (result.data) {
      toast.success(result.data.message || 'User deleted');
      refetch();
    } else if (result.error) {
      toast.error(getApiErrorMessage(result.error));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-sm text-gray-500">Create, edit, and delete users</p>
        </div>
        <Button onClick={() => setModalUser(undefined)}>
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {isError && <Alert variant="error">{getApiErrorMessage(error)}</Alert>}

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Interests</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Created</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)}
            {!isLoading && data?.data.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8">
                  <EmptyState title="No users found" />
                </td>
              </tr>
            )}
            {!isLoading &&
              data?.data.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge role={user.role}>{roleLabel(user.role)}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {user.interests?.length ? user.interests.join(', ') : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {user.createdAt ? formatDate(user.createdAt) : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setModalUser(user)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isDeleting || user._id === currentUser?.id}
                        onClick={() => handleDelete(user)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {data?.pagination && (
        <Pagination pagination={data.pagination} onPageChange={setPage} />
      )}

      {modalUser !== null && (
        <UserModal
          user={modalUser}
          onClose={() => setModalUser(null)}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}
