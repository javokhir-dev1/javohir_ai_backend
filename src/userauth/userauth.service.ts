import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import jwt from "jsonwebtoken";
import { UsersService } from 'src/users/users.service';
import crypto from "crypto";

@Injectable()
export class UserauthService {
  constructor(private readonly userService: UsersService) { }

  async login(loginDto: LoginDto) {
    const { telegram_id } = loginDto

    const { user } = await this.userService.findOneByTelegramId(String(telegram_id))

    const payload = { telegram_id: user.telegram_id, id: user.id, role: "user" }

    const secretKey = process.env.JWT_SECRET!
    
    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" })

    return { status: "success", message: "Login successful", user, token }
  }

  async register(registerDto: RegisterDto) {
    const { fullname, username, telegram_id, phone_number } = registerDto

    const { user } = await this.userService.create({ fullname, username, telegram_id, phone_number })

    return { status: "success", message: "Registration successful", user }
  }
}