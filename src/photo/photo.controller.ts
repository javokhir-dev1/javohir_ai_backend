import { Controller, Get, Post, Body, Patch, StreamableFile, Param, Delete, Res } from '@nestjs/common';
import { PhotoService } from './photo.service';
import type { Response } from 'express';
import { GeneratePhoto } from "./dto/GeneratePhoto.dto";

@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) { }

  @Post()
  async generatePhoto(@Body() data: GeneratePhoto) {
    return this.photoService.generatePhoto(data);
  } 
  
  @Get(':filename')
  getPhoto(@Param('filename') filename: string, @Res({ passthrough: true }) res: Response) {
    const file = this.photoService.getPhoto(filename);

    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });

    return new StreamableFile(file);
  }
}
