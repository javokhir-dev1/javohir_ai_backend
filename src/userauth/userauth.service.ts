import { 
  Injectable, 
  UnauthorizedException, 
  InternalServerErrorException, 
  BadRequestException,
  ConflictException
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as jwt from "jsonwebtoken"; 
import { UsersService } from '../users/users.service';

@Injectable()
export class UserauthService {
  constructor(private readonly userService: UsersService) { }

  async login(loginDto: LoginDto) {
    try {
      const { telegram_id } = loginDto;

      const result = await this.userService.findOneByTelegramId(String(telegram_id));
      const user = result.user;

      const secretKey = process.env.JWT_SECRET;
      if (!secretKey) {
        throw new InternalServerErrorException("JWT configuration is missing on server");
      }

      const payload = { 
        telegram_id: user.telegram_id, 
        id: user.id, 
        role: "user" 
      };

      const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

      return { 
        status: "success", 
        message: "Login successful", 
        user, 
        token 
      };

    } catch (error) {
      if (error.status === 404) {
        throw new UnauthorizedException("User not registered. Please register first.");
      }
      
      if (error instanceof UnauthorizedException || error instanceof InternalServerErrorException) {
        throw error;
      }
      
      throw new InternalServerErrorException("An error occurred during login");
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      const result = await this.userService.create(registerDto);

      return { 
        status: "success", 
        message: "Registration successful", 
        user: result.user 
      };

    } catch (error) {
      if (error.status === 409) {
        throw new ConflictException("User already exists with this data");
      }

      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException("An error occurred during registration");
    }
  }
}