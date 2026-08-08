import { cn, roleBadgeColor } from '@/lib/utils';
import type { UserRole } from '@/types';

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  role?: UserRole;
  variant?: 'default' | 'success' | 'warning' | 'danger';
};

const variantClasses = {
  default: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
};

export function Badge({ children, className, role, variant = 'default' }: BadgeProps) {
  const colorClass = role ? roleBadgeColor(role) : variantClasses[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        colorClass,
        className,
      )}
    >
      {children}
    </span>
  );
}
