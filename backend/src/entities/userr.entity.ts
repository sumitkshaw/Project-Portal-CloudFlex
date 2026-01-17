// src/entities/user.entity.ts - UPDATED VERSION
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Unique, JoinColumn } from 'typeorm';
import { Client } from './client.entity';
import { ProjectUser } from './project-user.entity';

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ nullable: true })
  role: string; // 'admin' or 'member'

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Client, client => client.users)
  @JoinColumn({ name: 'client_id' })  // ADD THIS LINE
  client: Client;

  @Column({ name: 'client_id' })
  clientId: string;

  @OneToMany(() => ProjectUser, projectUser => projectUser.user)
  projectUsers: ProjectUser[];
}