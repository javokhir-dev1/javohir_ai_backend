import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { Chat } from './models/chat.model';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Chat]),
    UsersModule
  ],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService]
})
export class ChatsModule {}