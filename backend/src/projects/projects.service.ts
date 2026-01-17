// src/projects/projects.service.ts - SIMPLIFIED VERSION
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { ProjectUser } from '../entities/project-user.entity';
import { CreateProjectDto, UpdateProjectDto } from '../dtos/project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(ProjectUser)
    private projectUsersRepository: Repository<ProjectUser>,
  ) {}

  async findAll(user: any) {
    return this.projectsRepository.find({
      where: { 
        client: { id: user.clientId }
      },
      // REMOVED relations for now
      // relations: ['projectUsers', 'projectUsers.user'],
    });
  }

  async findOne(id: string, user: any) {
    const project = await this.projectsRepository.findOne({
      where: { 
        id,
        client: { id: user.clientId }
      },
      // REMOVED relations for now
      // relations: ['projectUsers', 'projectUsers.user'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async create(createProjectDto: CreateProjectDto, user: any) {
    if (user.role !== 'admin') {
      throw new ForbiddenException('Only admins can create projects');
    }

    const project = this.projectsRepository.create({
      name: createProjectDto.name,
      description: createProjectDto.description,
      client: { id: user.clientId },
    });

    return this.projectsRepository.save(project);
    // Database trigger will handle owner assignment
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, user: any) {
    const project = await this.findOne(id, user);
    
    // Temporarily skip owner check
    // const projectUser = await this.projectUsersRepository.findOne({
    //   where: { projectId: id, userId: user.id },
    // });
    // if (!projectUser && user.role !== 'admin') {
    //   throw new ForbiddenException('Only project owner or admin can update');
    // }

    Object.assign(project, updateProjectDto);
    return this.projectsRepository.save(project);
  }

  async remove(id: string, user: any) {
    const project = await this.findOne(id, user);
    
    // Temporarily skip owner check
    // const projectUser = await this.projectUsersRepository.findOne({
    //   where: { projectId: id, userId: user.id },
    // });
    // if (!projectUser && user.role !== 'admin') {
    //   throw new ForbiddenException('Only project owner or admin can delete');
    // }

    await this.projectsRepository.remove(project);
    return { message: 'Project deleted successfully' };
  }

  // Temporarily comment out these methods
  /*
  async assignUser(projectId: string, userId: string, role: string, currentUser: any) {
    // Implementation...
  }

  async updateUserRole(projectId: string, userId: string, role: string, currentUser: any) {
    // Implementation...
  }

  async removeUser(projectId: string, userId: string, currentUser: any) {
    // Implementation...
  }

  async getProjectUsers(projectId: string, currentUser: any) {
    // Implementation...
  }
  */
}