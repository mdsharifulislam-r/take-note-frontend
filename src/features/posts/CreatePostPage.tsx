import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCreatePostMutation } from '@/features/posts/postsApi';
import { postSchema, type PostFormData } from '@/lib/schemas';
import { useApiFormErrors } from '@/lib/formErrors';
import { getApiErrorMessage } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { toast } from 'sonner';

export function CreatePostPage() {
  const navigate = useNavigate();
  const [createPost, { isLoading, error }] = useCreatePostMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  useApiFormErrors(error, setError);

  const onSubmit = async (data: PostFormData) => {
    const result = await createPost(data);
    if (result.data) {
      toast.success(result.data.message || 'Post created');
      navigate('/notes');
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        to="/notes"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create Post</CardTitle>
          <p className="text-sm text-gray-500">Share a new post with the community</p>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Title"
            placeholder="Post title"
            error={errors.title?.message}
            {...register('title')}
          />
          <Textarea
            label="Content"
            placeholder="Write your post..."
            rows={8}
            error={errors.content?.message}
            {...register('content')}
          />

          {error && <Alert variant="error">{getApiErrorMessage(error)}</Alert>}

          <div className="flex gap-3">
            <Button type="submit" isLoading={isLoading}>
              Create Post
            </Button>
            <Link to="/notes">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
