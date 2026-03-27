import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  BadRequestException,
  InternalServerErrorException 
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userModel.findOne({
        where: { telegram_id: createUserDto.telegram_id }
      });

      if (existingUser) {
        throw new ConflictException("User with this Telegram ID already exists");
      }

      const newUser = await this.userModel.create({ ...createUserDto });
      return { status: "success", message: "User created successfully", user: newUser };

    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException("Phone number or username already taken");
      }
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException("Error creating user");
    }
  }

  async findAll() {
    const users = await this.userModel.findAll();
    return { status: "success", message: "Users found", users };
  }

  async findOne(id: number) {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return { status: "success", message: "User found", user };
  }

  async findOneByTelegramId(telegram_id: string) {
    const user = await this.userModel.findOne({ where: { telegram_id } });
    if (!user) {
      throw new NotFoundException("User not found by telegram_id");
    }
    return { status: "success", message: "User found", user };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { user } = await this.findOne(id);

    try {
      const updatedUser = await user.update(updateUserDto);
      return { status: "success", message: "User updated successfully", user: updatedUser };
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException("New details already used by another user");
      }
      throw new InternalServerErrorException("Error updating user");
    }
  }

  async remove(id: number) {
    const deletedCount = await this.userModel.destroy({ where: { id } });
    if (!deletedCount) {
      throw new NotFoundException("User not found to delete");
    }
    return { status: "success", message: "User deleted successfully" };
  }
}