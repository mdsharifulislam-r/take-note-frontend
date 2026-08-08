import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  PenSquare,
  User,
  Users,
  X,
  Tags,
  Newspaper,
} from 'lucide-react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';
import { Badge } from '@/components/ui/Badge';
import { cn, getImageUrl, isAdmin, roleLabel } from '@/lib/utils';

const userNavItems = [
  { to: '/notes', label: 'My Notes', icon: FileText },
  { to: '/notes/new', label: 'New Note', icon: PenSquare },
  { to: '/posts/new', label: 'Create Post', icon: Newspaper },
  { to: '/profile', label: 'Profile', icon: User },
];

const adminNavItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/notes', label: 'All Notes', icon: BookOpen },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/interests', label: 'By Interests', icon: Tags },
  { to: '/admin/user-posts', label: 'User Posts', icon: Newspaper },
];

function NavItem({
  to,
  label,
  icon: Icon,
  onClick,
}: {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary-50 text-primary-700'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        )
      }
    >
      <Icon className="h-5 w-5" />
      {label}
    </NavLink>
  );
}

export function AppLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const avatarUrl = getImageUrl(user?.profileImage);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <span className="text-lg font-bold text-primary-700">Note Taker</span>
          <button
            className="rounded-lg p-1 hover:bg-gray-100 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Notes
          </p>
          {userNavItems.map((item) => (
            <NavItem key={item.to} {...item} onClick={() => setSidebarOpen(false)} />
          ))}

          {user && isAdmin(user.role) && (
            <>
              <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Admin
              </p>
              {adminNavItems.map((item) => (
                <NavItem key={item.to} {...item} onClick={() => setSidebarOpen(false)} />
              ))}
            </>
          )}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <div className="mb-3 flex items-center gap-3">
            {avatarUrl ? (
              <img src={avatarUrl} alt={user?.name} className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                <User className="h-5 w-5" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">{user?.name}</p>
              {user && <Badge role={user.role}>{roleLabel(user.role)}</Badge>}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b border-gray-200 bg-white px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 hover:bg-gray-100"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="ml-3 text-lg font-bold text-primary-700">Note Taker</span>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
