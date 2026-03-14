import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { fullname, username, telegram_id, phone_number } = createUserDto

    const newUser = await this.userModel.create({
      username,
      telegram_id,
      phone_number,
      fullname,
      is_verified: false,
    })

    if (!newUser) {
      throw new NotFoundException("User not created")
    }

    return { message: "user created successfully", user: newUser }
  }

  async findAll() {
    const users = await this.userModel.findAll()
    return users;
  }

  async findOne(id: number) {
    const user = await this.userModel.findOne({ where: { id } })
    if (!user) {
      throw new UnauthorizedException("User not registered")
    }
    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id)

    const updatedUser = await user.update(updateUserDto)

    return updatedUser
  }

  async remove(id: number) {
    const user = await this.userModel.destroy({ where: { id } })
    if (!user) {
      throw new NotFoundException("User not found")
    }
    return { message: "User deleted successfully", user }
  }
}