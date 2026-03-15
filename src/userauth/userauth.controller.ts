import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserauthService } from './userauth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('userauth')
export class UserauthController {
  constructor(private readonly userauthService: UserauthService) { }
  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.userauthService.login(loginDto);
  }

  @Post("register")
  register(@Body() registerDto: RegisterDto) {
    return this.userauthService.register(registerDto);
  }
}
