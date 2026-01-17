// frontend/app/projects/[id]/edit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import Link from 'next/link';
import { showSuccess, showError } from '@/lib/toast';
import { useAuth } from '@/contexts/AuthContext';

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';

  // Redirect non-admins immediately
  useEffect(() => {
    if (!isAdmin) {
      showError('Only admin users can edit projects');
      router.push('/dashboard');
    }
  }, [isAdmin, router]);

  useEffect(() => {
    if (params.id && isAdmin) {
      fetchProject(params.id as string);
    }
  }, [params.id, isAdmin]);

  const fetchProject = async (id: string) => {
    try {
      const response = await api.get(`/api/projects/${id}`);
      setName(response.data.name);
      setDescription(response.data.description || '');
    } catch (err: any) {
      const errorMsg = 'Failed to load project';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setIsFetching(false);
    }
  };

  if (!isAdmin) {
    return (
      <ProtectedRoute>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">Access Denied</div>
          <p className="text-gray-600 mb-4">Only admin users can edit projects.</p>
          <Link href="/dashboard" className="text-primary-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  if (isFetching) {
    return (
      <ProtectedRoute>
        <div className="text-center py-8">Loading project...</div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            {error}
          </div>
          <Link href="/dashboard" className="text-primary-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.put(`/api/projects/${params.id}`, {
        name,
        description: description || undefined,
      });
      showSuccess('Project updated successfully!');
      router.push(`/projects/${params.id}`);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to update project';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href={`/projects/${params.id}`} className="text-primary-600 hover:underline">
            ← Back to Project
          </Link>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-green-100 rounded-full mr-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Edit Project</h1>
              <p className="text-sm text-gray-600">Admin access required</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="name">
                Project Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="description">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={4}
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'Update Project'}
              </button>
              <button
                type="button"
                onClick={() => router.push(`/projects/${params.id}`)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}