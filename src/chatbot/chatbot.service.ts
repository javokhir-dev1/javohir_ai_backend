import { Injectable, Inject } from '@nestjs/common';
import { SendMessageText } from "./dto/SendMessageText.dto";
import { GoogleGenAI } from '@google/genai'
import { MessagesService } from 'src/messages/messages.service';

@Injectable()
export class ChatbotService {
  constructor(
    private readonly messageService: MessagesService,
    @Inject('AI_CLIENT_GEMINI') private readonly gemini: GoogleGenAI
  ) { }

  async *sendMessageText(data: SendMessageText) {
    const { text, model, chat_id } = data
    
    const models = {
      flash: "gemini-3.1-flash-lite-preview",
      pro: "gemini-3.1-pro-preview"
    }
    const stream = await this.gemini.models.generateContentStream({
      model: models[model],
      contents: [
        {
          role: 'user',
          parts: [{ text: text }]
        }
      ],
      config: {
        systemInstruction: "Sening isming 'Jevel AI'. Sen dasturchi Javohir tomonidan yaratilgansan. DIQQAT: O'zingni faqat va faqat sendan 'Kimsan?' yoki 'Qaysi modelsan' yoki 'nimasan?' deb so'ralgandagina shu nom bilan tanishtirishing shart. Boshqa barcha holatlarda (savol-javob, kod yozish va hokazo) o'zingni tanishtirmasdan to'g'ridan-to'g'ri vazifaga o't."
      }
    });

    for await (const chunk of stream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  }
}
