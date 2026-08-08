import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <h1 className="text-6xl font-bold text-primary-600">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-900">Page not found</h2>
      <p className="mt-2 text-gray-500">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/" className="mt-6">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}

export function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <h1 className="text-6xl font-bold text-red-600">403</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-900">Unauthorized</h2>
      <p className="mt-2 text-gray-500">You don&apos;t have permission to access this page.</p>
      <Link to="/notes" className="mt-6">
        <Button>Go to My Notes</Button>
      </Link>
    </div>
  );
}
