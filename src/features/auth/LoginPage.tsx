import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '@/features/auth/authApi';
import { setCredentials } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/app/hooks';
import { loginSchema, type LoginFormData } from '@/lib/schemas';
import { useApiFormErrors } from '@/lib/formErrors';
import { getApiErrorMessage, isAdmin } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { toast } from 'sonner';

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useApiFormErrors(error, setError);

  const onSubmit = async (data: LoginFormData) => {
    const result = await login(data);
    if (result.data) {
      dispatch(setCredentials(result.data.data));
      toast.success(result.data.message || 'Logged in successfully');
      const role = result.data.data.user.role;
      navigate(isAdmin(role) ? '/admin' : '/notes');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <p className="text-sm text-gray-500">Sign in to your Note Taker account</p>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          {error && (
            <Alert variant="error">{getApiErrorMessage(error)}</Alert>
          )}

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-700">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}
