import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { GoogleGenAI } from '@google/genai';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as fss from 'fs';
import { v4 as uuid } from 'uuid';
import { Observable, Subscriber } from 'rxjs';


@Injectable()
export class VideoService {
  constructor(
    @Inject('AI_CLIENT_GEMINI') private readonly gemini: GoogleGenAI,
  ) { }
  async create(createVideoDto: CreateVideoDto) {
    const { prompt } = createVideoDto;
    let operation = await this.gemini.models.generateVideos({
      model: "veo-3.1-generate-preview",
      prompt: prompt,
      config: {
        resolution: "720p"
      }
    });

    while (!operation.done) {
      console.log("Video generatsiya qilinishi kutilmoqda...");
      await new Promise((resolve) => setTimeout(resolve, 10000));
      operation = await this.gemini.operations.getVideosOperation({
        operation: operation,
      });
    }

    const uploadDir = path.join(process.cwd(), 'uploads/videos');

    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const fileName = `${uuid()}.mp4`;
    const fullPath = path.join(uploadDir, fileName);

    const videoFile = operation.response?.generatedVideos?.[0]?.video;

    if (videoFile) {
      await this.gemini.files.download({
        file: videoFile,
        downloadPath: fullPath,
      });
      console.log(`Video muvaffaqiyatli saqlandi: ${fullPath}`);

      return { filename: fileName };
    } else {
      throw new Error("Generatsiya qilingan video topilmadi.");
    }
  }

  createWithProgress(createVideoDto: any): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      this.generateAndPoll(createVideoDto, subscriber);
    });
  }
  private async generateAndPoll(dto: any, subscriber: Subscriber<any>) {
    try {
      if (!dto || !dto.prompt) {
        throw new Error("Prompt bo'sh bo'lishi mumkin emas!");
      }
      let operation = await this.gemini.models.generateVideos({
        model: "veo-3.1-generate-preview",
        prompt: dto.prompt,
        config: { resolution: "720p" }
      });

      let fakeProgress = 0;
      const startTime = Date.now();

      // 2. Polling Loop
      while (!operation.done) {
        if (fakeProgress < 90) {
          fakeProgress += Math.floor(Math.random() * 10) + 5;
        } else if (fakeProgress < 95) {
          fakeProgress += 1;
        }

        subscriber.next({
          data: {
            isDone: false,
            progress: fakeProgress,
            message: "Video generatsiya qilinishi kutilmoqda...",
            elapsedTime: Math.floor((Date.now() - startTime) / 1000)
          }
        });

        await new Promise(r => setTimeout(r, 10000));
        operation = await this.gemini.operations.getVideosOperation({ operation });
      }

      // 3. Video tayyor bo'lganda yuklab olish
      const videoFile = operation.response?.generatedVideos?.[0]?.video;

      if (!videoFile) {
        throw new Error("Video topilmadi!");
      }

      const fileName = `${uuid()}.mp4`;
      const uploadDir = path.join(process.cwd(), 'uploads', 'videos');
      const fullPath = path.join(uploadDir, fileName);

      try {
        await fs.mkdir(uploadDir, { recursive: true });
      } catch (e) { }

      await this.gemini.files.download({
        file: videoFile,
        downloadPath: fullPath,
      });

      subscriber.next({
        data: {
          isDone: true,
          progress: 100,
          message: "Video muvaffaqiyatli saqlandi!",
          fileName: fileName
        }
      });

      subscriber.complete();

    } catch (error) {
      console.error("Video creation error:", error);
      subscriber.error(new InternalServerErrorException("Video yaratishda xatolik yuz berdi"));
    }
  }

  getVideo(filename: string) {
    const filePath = path.join(process.cwd(), 'uploads/videos', filename);

    if (!fss.existsSync(filePath)) {
      throw new NotFoundException('Fizik video fayli serverdan topilmadi');
    }

    return fss.createReadStream(filePath);
  }
}
