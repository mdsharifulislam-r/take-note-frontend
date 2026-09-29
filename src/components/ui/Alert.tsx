import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type AlertProps = {
  variant?: 'error' | 'success' | 'info';
  title?: string;
  children: React.ReactNode;
  className?: string;
};



const variants = {
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: AlertCircle,
  },
  success: {
    container: 'bg-green-50 border-green-200 text-green-800',
    icon: CheckCircle,
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: Info,
  },
};

export function Alert({ variant = 'info', title, children, className }: AlertProps) {
  const { container, icon: Icon } = variants[variant];

  return (
    <div className={cn('flex gap-3 rounded-lg border p-4', container, className)} role="alert">
      <Icon className="h-5 w-5 shrink-0" />
      <div>
        {title && <p className="font-medium">{title}</p>}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-gray-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
