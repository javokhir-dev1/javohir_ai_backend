import { Injectable, Inject } from '@nestjs/common';
import { SendMessageText } from "./dto/SendMessageText.dto";
import { GoogleGenAI } from '@google/genai'
import { MessagesService } from 'src/messages/messages.service';
import { Message } from 'src/messages/models/message.model';
import { ChatsService } from 'src/chats/chats.service';
import { CreateChatWithAIDTO } from './dto/create-chat.dto';
import { where } from 'sequelize';

@Injectable()
export class ChatbotService {
  constructor(
    private readonly messageService: MessagesService,
    private readonly chatsService: ChatsService,
    @Inject('AI_CLIENT_GEMINI') private readonly gemini: GoogleGenAI
  ) { }

  async sendRequestToAI(text: string, system: string) {
    const response = await this.gemini.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: text,
      config: {
        systemInstruction: system || "",
      },
    });
    return response.text
  }

  private async generateAndSaveTitle(chat, text) {
    try {
      const new_chat_name = await this.sendRequestToAI(text, "Siz chat sarlavhasi yaratuvchisiz. Faqat nom qaytaring.");
      await chat.update({ chat_title: new_chat_name });
    } catch (error) {
      console.error("AI nom yaratishda xatolik:", error);
    }
  }

  async createChatWithAI(createChat: CreateChatWithAIDTO) {
    const { text, user_id } = createChat;

    const { chat } = await this.chatsService.create({
      user_id,
      chat_title: text.substring(0, 30) + "..."
    });

    this.generateAndSaveTitle(chat, text);

    return { chat_id: chat.id };
  }


  async * sendMessageText(data: SendMessageText) {

    const { text, model, chat_id, user_id } = data;

    const { history: dbHistory } = await this.messageService.findAllByChatJson(Number(chat_id));
    
    console.log("=======================")
    console.log(JSON.stringify(dbHistory))
    console.log("=======================")

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
        systemInstruction: "Sening isming Jevel AI. Sen Javohir tomonidan yaratilgansan. O'z identifikatsiyang haqidagi ma'lumotni faqat foydalanuvchi bevosita kimliging yoki yaratuvching haqida so'ragandagina taqdim et. Har doim foydalanuvchining eng oxirgi yuborgan xabariga javob berishga e'tibor qarat, oldingi xabarlarni faqat kontekst sifatida tahlil qil."
      }
    })

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

    await this.messageService.create({
      chat_id: Number(chat_id),
      text: fullResponse,
      role: 'model',
      user_id
    });
  }
}
