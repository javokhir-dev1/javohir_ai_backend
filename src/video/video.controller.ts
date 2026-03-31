import { Controller, Get, Post, Body, Patch, Param, Delete, Res, StreamableFile, Sse, Query } from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import type { Response } from 'express';
import { Observable, Subscriber } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) { }

  @Post()
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videoService.create(createVideoDto);
  }

  @Sse('create-stream')
  createWithStream(@Query('prompt') prompt: string): Observable<MessageEvent> {
    return this.videoService.createWithProgress({ prompt }).pipe(
      map((status) => ({
        data: status.data,
      } as MessageEvent)),
    );
  }

  @Get('get-video/:filename')
  getVideo(@Param('filename') filename: string, @Res({ passthrough: true }) res: Response) {
    const file = this.videoService.getVideo(filename);

    res.set({
      'Content-Type': 'video/mp4',
      'Content-Disposition': `inline; filename="${filename}"`, // 'inline' brauzerda ko'rish imkonini beradi
    });

    return new StreamableFile(file);
  }

}
