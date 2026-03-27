import { Module } from '@nestjs/common';
import { ChatbotModule } from './chatbot/chatbot.module';
import { ConfigModule } from '@nestjs/config';
import { GeminiModule } from './gemini/gemini.module';
import { PhotoModule } from './photo/photo.module';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserauthModule } from './userauth/userauth.module';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DB_USER,
      password: String(process.env.DB_PASS),
      database: process.env.DB_NAME,
      autoLoadModels: true,
      sync: { alter: true }
    }),

    PhotoModule,

    GeminiModule,
    
    ChatbotModule,

    UsersModule,

    UserauthModule,

    ChatsModule,

    MessagesModule,
  ],
})

export class AppModule { }
