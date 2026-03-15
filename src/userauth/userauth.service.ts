import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import jwt from "jsonwebtoken";
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UserauthService {
  constructor(private readonly userService: UsersService) {}
  async login(loginDto: LoginDto) {
    return { message: "Login successful" }
  }

  async register(registerDto: RegisterDto) {
    return { message: "Registration successful" }
  }
}