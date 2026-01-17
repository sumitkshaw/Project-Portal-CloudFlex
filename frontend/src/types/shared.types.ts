// src/types/shared.types.ts
export interface User {
  id: string;
  email: string;
  role?: string;
  clientId: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectUser {
  id: string;
  projectId: string;
  userId: string;
  role: 'owner' | 'developer' | 'viewer';
  user?: User;
}

export interface Client {
  id: string;
  name: string;
}

export type UserRole = 'admin' | 'member';
export type ProjectRole = 'owner' | 'developer' | 'viewer';