import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserauthService } from './userauth.service';
import { LoginDto } from './dto/login.dto';
import { GetOtp } from './dto/get-otp.dto';

@Controller('userauth')
export class UserauthController {
  constructor(private readonly userauthService: UserauthService) { }
  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.userauthService.login(loginDto);
  }

  @Post("get-otp")
  getOtp(@Body() getOtp: GetOtp) {
    return this.userauthService.getOtp(getOtp);
  }
}
