import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { MessagesModule } from 'src/messages/messages.module';
import { ChatsModule } from 'src/chats/chats.module';

@Module({
  imports: [MessagesModule, ChatsModule],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}
