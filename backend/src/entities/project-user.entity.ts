import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Unique } from 'typeorm';
import { Project } from './project.entity';
import { User } from './userr.entity';

@Entity('project_users')
@Unique(['projectId', 'userId'])
export class ProjectUser {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'project_id' })
    projectId: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column()
    role: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => Project, project => project.projectUsers, { onDelete: 'CASCADE' })
    project: Project;

    @ManyToOne(() => User, user => user.projectUsers, { onDelete: 'CASCADE' })
    user: User;
}