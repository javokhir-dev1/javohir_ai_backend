import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Message } from './models/message.model';
import { User } from '../users/models/user.model';
import { ChatsModule } from 'src/chats/chats.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Message, User]),
    ChatsModule 
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService] 
})
export class MessagesModule {}