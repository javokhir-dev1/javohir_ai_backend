import { 
  Injectable, 
  NotFoundException, 
  InternalServerErrorException, 
  BadRequestException 
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './models/message.model';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChatsService } from '../chats/chats.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message)
    private messageModel: typeof Message,
    private readonly chatsService: ChatsService
  ) { }

  async create(createMessageDto: CreateMessageDto) {
    const { chat_id } = createMessageDto;

    await this.chatsService.findOne(chat_id);

    try {
      const newMessage = await this.messageModel.create({ ...createMessageDto });

      return {
        status: 'success',
        message: 'Message saved successfully',
        data: newMessage,
      };
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while saving the message');
    }
  }

  async findAllByChat(chat_id: number) {
    await this.chatsService.findOne(chat_id);

    try {
      const history = await this.messageModel.findAll({
        where: { chat_id },
      });

      return {
        status: 'success',
        message: 'Chat history retrieved successfully',
        history
      };
    } catch (error) {
      throw new InternalServerErrorException('Could not retrieve chat history');
    }
  }

  async remove(id: number) {
    try {
      const affectedRows = await this.messageModel.destroy({ where: { id } });
      
      if (!affectedRows) {
        throw new NotFoundException(`Message with ID ${id} not found`);
      }

      return { 
        status: 'success', 
        message: 'Message deleted successfully' 
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error deleting message');
    }
  }
}