// frontend/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/api/projects');
      setProjects(response.data);
    } catch (err: any) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, projectName: string) => {
    if (!confirm(`Are you sure you want to delete "${projectName}"?`)) return;
    
    try {
      await api.delete(`/api/projects/${id}`);
      showSuccess(`Project "${projectName}" deleted successfully!`);
      setProjects(projects.filter(project => project.id !== id));
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to delete project';
      if (errorMsg.includes('Only admins')) {
        showError('Only admin users can delete projects');
      } else {
        showError(errorMsg);
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Projects</h2>
          {isAdmin && (
            <Link
              href="/projects/create"
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              + New Project
            </Link>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No projects yet. {isAdmin ? 'Create your first project!' : 'Only admins can create projects.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                {project.description && (
                  <p className="text-gray-600 mb-4">{project.description}</p>
                )}
                <div className="text-sm text-gray-500 mb-4">
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={`/projects/${project.id}`}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200"
                  >
                    View
                  </Link>
                  {isAdmin && (
                    <>
                      <Link
                        href={`/projects/${project.id}/edit`}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id, project.name)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}