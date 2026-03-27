import { Injectable, Inject } from '@nestjs/common';
import { SendMessageText } from "./dto/SendMessageText.dto";
import { GoogleGenAI } from '@google/genai'
import { MessagesService } from 'src/messages/messages.service';
import { Message } from 'src/messages/models/message.model';

@Injectable()
export class ChatbotService {
  constructor(
    private readonly messageService: MessagesService,
    @Inject('AI_CLIENT_GEMINI') private readonly gemini: GoogleGenAI
  ) { }




  async * sendMessageText(data: SendMessageText) {

    const formatChatHistory = (history: any[]): any[] => {
      return history.map((item: any) => ({
        role: item.role,
        parts: [{ text: item.text }]
      }));
    };
    const { text, model, chat_id, user_id } = data;

    const { history: dbHistory } = await this.messageService.findAllByChatJson(chat_id);
    console.log("======================")
    console.log(dbHistory)
    console.log("======================")
    await this.messageService.create({
      chat_id,
      text,
      role: 'user',
      user_id
    });
    
    const models = {
      flash: "gemini-3.1-flash-lite-preview",
      pro: "gemini-3.1-pro-preview"
    };
    
    const chat = this.gemini.chats.create({
      model: models[model],
      history: dbHistory,
      config: {
        systemInstruction: "Sening isming 'Jevel AI'. Sen dasturchi Javohir tomonidan yaratilgansan..."
      }
    });
    
    // 5. Xabarni yuborish va stream olish
    const stream = await chat.sendMessageStream({
      message: text
    });
    
    let fullResponse = "";
    
    for await (const chunk of stream) {
      if (chunk.text) {
        const chunkText = chunk.text;
        fullResponse += chunkText;
        yield chunkText;
      }
    }
    
    console.log("===========================")
    console.log(fullResponse)
    console.log("===========================")
    
    await this.messageService.create({
      chat_id,
      text: fullResponse,
      role: 'model',
      user_id
    });
  }
}
