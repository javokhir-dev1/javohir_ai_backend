import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Chat } from './models/chat.model';
import { CreateChatDto } from './dto/create-chat.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat)
    private chatModel: typeof Chat,
    private readonly usersService: UsersService,
  ) { }

  async create(createChatDto: CreateChatDto) {
    try {
      if (!createChatDto.user_id) {
        throw new BadRequestException('User ID is required to create a chat');
      }
      await this.usersService.findOne(+createChatDto.user_id);

      const chat = await this.chatModel.create({ ...createChatDto });

      return {
        status: 'success',
        message: 'Chat created successfully',
        chat
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('An error occurred while creating the chat');
    }
  }

  async findAllByUserId(user_id: string) {
    try {
      await this.usersService.findOne(+user_id);

      const chats = await this.chatModel.findAll({
        where: { user_id },
      });

      return {
        status: 'success',
        results: chats.length,
        chats
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Could not retrieve chats');
    }
  }

  async findOne(id: number) {
    try {
      const chat = await this.chatModel.findByPk(id);

      if (!chat) {
        throw new NotFoundException(`Chat with ID ${id} not found`);
      }

      return chat;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error fetching the chat');
    }
  }

  async remove(id: number) {
    try {
      const deletedRows = await this.chatModel.destroy({ where: { id } });

      if (!deletedRows) {
        throw new NotFoundException(`Chat with ID ${id} not found`);
      }

      return {
        status: 'success',
        message: 'Chat and its history deleted successfully'
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('An error occurred while deleting the chat');
    }
  }
}