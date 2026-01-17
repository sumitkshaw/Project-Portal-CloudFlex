// src/dtos/auth.dto.ts
import { IsEmail, IsString, MinLength, IsOptional, IsUUID } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  role?: string; // 'admin' or 'member'

  @IsUUID()
  clientId: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}