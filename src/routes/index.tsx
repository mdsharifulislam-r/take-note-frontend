import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute, PublicOnlyRoute, AdminRoute } from '@/routes/guards';
import { NotFoundPage, UnauthorizedPage } from '@/routes/ErrorPages';
import { LoginPage } from '@/features/auth/LoginPage';
import { SignupPage } from '@/features/auth/SignupPage';
import { ProfilePage } from '@/features/auth/ProfilePage';
import { MyNotesPage } from '@/features/notes/MyNotesPage';
import { NoteDetailPage } from '@/features/notes/NoteDetailPage';
import { NoteFormPage } from '@/features/notes/NoteFormPage';
import { CreatePostPage } from '@/features/posts/CreatePostPage';
import { AdminDashboardPage } from '@/features/admin/AdminDashboardPage';
import { AllNotesPage } from '@/features/admin/AllNotesPage';
import { UsersManagementPage } from '@/features/admin/UsersManagementPage';
import { UsersByInterestsPage } from '@/features/admin/UsersByInterestsPage';
import { UserPostsPage } from '@/features/admin/UserPostsPage';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/notes" replace />} />
            <Route path="/notes" element={<MyNotesPage />} />
            <Route path="/notes/new" element={<NoteFormPage />} />
            <Route path="/notes/:id" element={<NoteDetailPage />} />
            <Route path="/notes/:id/edit" element={<NoteFormPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/posts/new" element={<CreatePostPage />} />

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/notes" element={<AllNotesPage />} />
              <Route path="/admin/users" element={<UsersManagementPage />} />
              <Route path="/admin/interests" element={<UsersByInterestsPage />} />
              <Route path="/admin/user-posts" element={<UserPostsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
