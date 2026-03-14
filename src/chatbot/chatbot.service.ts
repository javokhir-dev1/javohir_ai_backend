import { Injectable, Inject } from '@nestjs/common';
import { SendMessageText } from "./dto/SendMessageText.dto";
import { GoogleGenAI } from '@google/genai'

@Injectable()
export class ChatbotService {
  constructor(@Inject('AI_CLIENT_GEMINI') private readonly gemini: GoogleGenAI) { }

  async *sendMessageText(data: SendMessageText) {
    const models = {
      flash: "gemini-3.1-flash-lite-preview",
      pro: "gemini-3.1-pro-preview"
    }
    const stream = await this.gemini.models.generateContentStream({
      model: models[data.model],
      contents: [
        {
          role: 'user',
          parts: [{ text: data.text }]
        }
      ]
    });

    for await (const chunk of stream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  }
}
