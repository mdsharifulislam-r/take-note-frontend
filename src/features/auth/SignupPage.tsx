import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useSignupMutation } from '@/features/auth/authApi';
import { setCredentials } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/app/hooks';
import { signupSchema, type SignupFormData } from '@/lib/schemas';
import { useApiFormErrors } from '@/lib/formErrors';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { TagsInput } from '@/components/ui/TagsInput';
import { toast } from 'sonner';

export function SignupPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [signup, { isLoading, error }] = useSignupMutation();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { interests: [] },
  });

  useApiFormErrors(error, setError);

  const onSubmit = async (data: SignupFormData) => {
    const result = await signup(data);
    if (result.data) {
      dispatch(setCredentials(result.data.data));
      toast.success(result.data.message || 'Account created successfully');
      navigate('/notes');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <p className="text-sm text-gray-500">Join Note Taker and start organizing</p>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Name"
            placeholder="Your name"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <Controller
            name="interests"
            control={control}
            render={({ field }) => (
              <TagsInput
                label="Interests (optional)"
                value={field.value || []}
                onChange={field.onChange}
                error={errors.interests?.message}
              />
            )}
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
