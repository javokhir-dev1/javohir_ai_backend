import { GoogleGenAI } from "@google/genai";
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GeneratePhoto } from "./dto/GeneratePhoto.dto";
import * as fs from "node:fs/promises";
import * as fssync from "node:fs";
import * as path from "path";
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from "@nestjs/sequelize";
import { Photo } from "./models/photo.model";

@Injectable()
export class PhotoService {
  constructor(
    @Inject('AI_CLIENT_GEMINI') private readonly gemini: GoogleGenAI,
    @InjectModel(Photo) private readonly photoModel: typeof Photo
  ) { }

  async generatePhoto(data: GeneratePhoto) {
    const { text, telegram_id } = data

    const response = await this.gemini.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: text,
    });

    const uploadDir = path.join(process.cwd(), 'uploads');

    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.text) {
        console.log(part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data!;

        const fileName = `${uuidv4()}.jpg`;

        const filePath = path.join(process.cwd(), 'uploads', fileName);

        const buffer = Buffer.from(imageData, "base64");

        await fs.writeFile(filePath, buffer);

        await this.photoModel.create({ telegram_id, photo_id: fileName });

        return { status: "success", message: "photo generated successfully", filename: fileName };
      }
    }
    return { status: "error", message: "photo generation failed" };
  }

  async generatePhotoWithImage(file: Express.Multer.File, prompt: string) {
    const base64String = file.buffer.toString('base64');
    const promptArr = [
      {
        text: prompt
      },
      {
        inlineData: {
          mimeType: "image/png",
          data: base64String,
        },
      },
    ];

    const response = await this.gemini.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: promptArr,
    });

    const uploadDir = path.join(process.cwd(), 'uploads');

    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.text) {
        console.log(part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data!;

        const fileName = `${uuidv4()}.jpg`;

        const filePath = path.join(process.cwd(), 'uploads', fileName);

        const buffer = Buffer.from(imageData, "base64");

        await fs.writeFile(filePath, buffer);

        await this.photoModel.create({ photo_id: fileName });

        return { status: "success", message: "photo generated successfully", filename: fileName };
      }
    }
    return { status: "error", message: "photo generation failed" };
  }

  getPhoto(filename: string) {
    const photoRecord = this.photoModel.findOne({ where: { photo_id: filename } });
    if (!photoRecord) {
      throw new NotFoundException('Fayl topilmadi');
    }

    const filePath = join(process.cwd(), 'uploads', filename);

    return createReadStream(filePath);
  }
}
