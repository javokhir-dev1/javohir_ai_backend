import { GoogleGenAI } from "@google/genai";
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GeneratePhoto } from "./dto/GeneratePhoto.dto";
import * as fs from "node:fs/promises"; 
import * as path from "path";
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class PhotoService {
  constructor(@Inject('AI_CLIENT_GEMINI') private readonly gemini: GoogleGenAI) { }

  async generatePhoto(data: GeneratePhoto) {
    const response = await this.gemini.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: data.text,
    });

    const uploadDir = path.join(process.cwd(), 'uploads');

    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }
                                    
    const part = response.candidates?.[0]?.content?.parts?.[0];

    if (part?.inlineData?.data) { 
      const fileName = `image_${Date.now()}.png`;
      const filePath = path.join(process.cwd(), 'uploads', fileName);

      const buffer = Buffer.from(part.inlineData.data as string, "base64");
      await fs.writeFile(filePath, buffer);

      return `Rasm muvaffaqiyatli saqlandi: ${fileName}`;
    }

    return "Rasm generatsiya qilinmadi."; 
  }

  getPhoto(filename: string) {
    const filePath = join(process.cwd(), 'uploads', filename); 

    if (!existsSync(filePath)) {
      throw new NotFoundException('Fayl topilmadi');
    }

    return createReadStream(filePath);
  }
}
