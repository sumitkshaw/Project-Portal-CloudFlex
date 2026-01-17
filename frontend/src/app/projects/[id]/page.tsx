// frontend/app/projects/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import Link from 'next/link';
import { showSuccess, showError } from '@/lib/toast';
import { useAuth } from '@/contexts/AuthContext';

interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (params.id) {
      fetchProject(params.id as string);
    }
  }, [params.id]);

  const fetchProject = async (id: string) => {
    try {
      const response = await api.get(`/api/projects/${id}`);
      setProject(response.data);
    } catch (err: any) {
      setError('Failed to load project');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!project || !confirm(`Are you sure you want to delete "${project.name}"?`)) return;
    
    try {
      await api.delete(`/api/projects/${project.id}`);
      showSuccess(`Project "${project.name}" deleted successfully!`);
      router.push('/dashboard');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to delete project';
      if (errorMsg.includes('Only admins')) {
        showError('Only admin users can delete projects');
      } else {
        showError(errorMsg);
      }
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="text-center py-8">Loading project...</div>
      </ProtectedRoute>
    );
  }

  if (error || !project) {
    return (
      <ProtectedRoute>
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            {error || 'Project not found'}
          </div>
          <Link href="/dashboard" className="text-primary-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard" className="text-primary-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
              <div className="text-gray-500 text-sm">
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </div>
            </div>
            {isAdmin && (
              <div className="flex space-x-2">
                <Link
                  href={`/projects/${project.id}/edit`}
                  className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                >
                  Edit Project
                </Link>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete Project
                </button>
              </div>
            )}
          </div>

          {project.description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{project.description}</p>
            </div>
          )}

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Project Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Project ID</label>
                <p className="mt-1 text-sm font-mono bg-gray-100 p-2 rounded">{project.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                <p className="mt-1">{new Date(project.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-6">
            <h2 className="text-xl font-semibold mb-4">Permissions</h2>
            <div className={`p-4 rounded-lg ${isAdmin ? 'bg-green-50' : 'bg-blue-50'}`}>
              <div className="flex items-center">
                <div className={`p-2 rounded-full ${isAdmin ? 'bg-green-100' : 'bg-blue-100'}`}>
                  {isAdmin ? (
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">
                    {isAdmin ? 'Admin Access' : 'Member Access'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {isAdmin 
                      ? 'You have full permissions to create, edit, and delete projects.'
                      : 'You can view projects. Only admins can create, edit, or delete projects.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}