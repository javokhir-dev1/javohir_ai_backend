import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { GetOtp } from './dto/get-otp.dto';
import { UsersService } from 'src/users/users.service';
import { generateSecret, generate, verify } from "otplib";

@Injectable()
export class UserauthService {
  constructor(
    private readonly userService: UsersService
  ) { }

  generateToken(secret: string) {
    const token = generate({ secret, digits: 6, period: 60 })
    return token
  }

  verifyToken(secret: string, token: string) {
    return verify({ secret, token, digits: 6, period: 60 })
  }

  async getOtp(getOtp: GetOtp) {
    const { telegram_id, phone_number, username, fullname } = getOtp;

    const { user } = await this.userService.create({
      fullname,
      username,
      phone_number,
      telegram_id,
    })

    const secret = process.env.OTP_SECRET!

    const token = this.generateToken(secret)

    await user.update({ otp: String(token) })
    
    return token
  }

  login(loginDto: LoginDto) {
    const { otp } = loginDto
    const secret = process.env.OTP_SECRET!
    const isVerified = this.verifyToken(secret, otp)
    return isVerified
  }
}