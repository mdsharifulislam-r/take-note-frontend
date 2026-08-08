import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/features/auth/authApi';
import { updateUser } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/app/hooks';
import { profileSchema, type ProfileFormData } from '@/lib/schemas';
import { useApiFormErrors } from '@/lib/formErrors';
import { formatDate, getApiErrorMessage, getImageUrl } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { TagsInput } from '@/components/ui/TagsInput';
import { FileInput } from '@/components/ui/FileInput';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { roleLabel } from '@/lib/utils';
import { toast } from 'sonner';
import { useState } from 'react';

export function ProfilePage() {
  const dispatch = useAppDispatch();
  const { data, isLoading, isError, error: fetchError } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating, error: updateError }] = useUpdateProfileMutation();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const profile = data?.data;

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { interests: [] },
  });

  useApiFormErrors(updateError, setError);

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        email: profile.email,
        password: '',
        interests: profile.interests || [],
      });
    }
  }, [profile, reset]);

  const onSubmit = async (formData: ProfileFormData) => {
    const body = new FormData();
    if (formData.name) body.append('name', formData.name);
    if (formData.email) body.append('email', formData.email);
    if (formData.password) body.append('password', formData.password);
    if (formData.interests?.length) {
      formData.interests.forEach((interest) => body.append('interests', interest));
    }
    if (imageFile) body.append('profileImage', imageFile);

    const result = await updateProfile(body);
    if (result.data) {
      const updated = result.data.data;
      dispatch(
        updateUser({
          id: updated.id,
          name: updated.name,
          email: updated.email,
          role: updated.role,
          interests: updated.interests,
          profileImage: updated.profileImage,
        }),
      );
      toast.success(result.data.message || 'Profile updated');
      setImageFile(null);
    }
  };

  if (isLoading) return <PageLoader />;
  if (isError) return <Alert variant="error">{getApiErrorMessage(fetchError)}</Alert>;
  if (!profile) return <Alert variant="error">Profile not found</Alert>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500">Manage your account settings</p>
      </div>

      <Card>
        <div className="mb-6 flex items-center gap-4">
          {getImageUrl(profile.profileImage) ? (
            <img
              src={getImageUrl(profile.profileImage)}
              alt={profile.name}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-700">
              {profile.name.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold">{profile.name}</h2>
            <p className="text-sm text-gray-500">{profile.email}</p>
            <div className="mt-1 flex items-center gap-2">
              <Badge role={profile.role}>{roleLabel(profile.role)}</Badge>
              <span className="text-xs text-gray-400">
                Joined {formatDate(profile.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Name"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="New Password"
            type="password"
            placeholder="Leave blank to keep current"
            error={errors.password?.message}
            {...register('password')}
          />
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
          <FileInput
            label="Profile Image"
            previewUrl={getImageUrl(profile.profileImage)}
            onChange={setImageFile}
          />

          {updateError && <Alert variant="error">{getApiErrorMessage(updateError)}</Alert>}

          <Button type="submit" isLoading={isUpdating}>
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
}
