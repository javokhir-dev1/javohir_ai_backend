import { Controller, Get, Post, Body, Patch, StreamableFile, Param, UploadedFile, Delete, Res, UseInterceptors } from '@nestjs/common';
import { PhotoService } from './photo.service';
import type { Response } from 'express';
import { GeneratePhoto } from "./dto/GeneratePhoto.dto";
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) { }

  @Post()
  async generatePhoto(@Body() data: GeneratePhoto) {
    return this.photoService.generatePhoto(data);
  }

  @Post('edit')
  @UseInterceptors(FileInterceptor('image')) // Front-enddan 'image' key bilan yuboring
  async editPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Body('prompt') prompt: string,
  ) {
    return this.photoService.generatePhotoWithImage(file, prompt);
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
