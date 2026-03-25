import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { SendMessageText } from "./dto/SendMessageText.dto";
import type { Response } from "express";

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post("gemini")
  async SendMessageText(@Body() data: SendMessageText, @Res() res: Response) {

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    res.flushHeaders();

    const stream = this.chatbotService.sendMessageText(data);

    for await (const chunk of stream) {
      res.write(chunk)
    }

    res.end();
  }
}
