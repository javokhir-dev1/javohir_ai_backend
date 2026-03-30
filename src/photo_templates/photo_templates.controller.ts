import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseInterceptors, UploadedFiles,
  Res,
  StreamableFile
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PhotoTemplatesService } from './photo_templates.service';
import { CreatePhotoTemplateDto } from './dto/create-photo_template.dto';
import { UpdatePhotoTemplateDto } from './dto/update-photo_template.dto';
import type { Response } from 'express';

@Controller('photo-templates')
export class PhotoTemplatesController {
  constructor(private readonly service: PhotoTemplatesService) { }

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'before_img', maxCount: 1 },
    { name: 'after_img', maxCount: 1 },
  ], {
    storage: diskStorage({
      destination: './uploads/photo-templates',
      filename: (req, file, callback) => {
        const name = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, `${file.fieldname}-${name}${extname(file.originalname)}`);
      },
    }),
  }))

  create(
    @UploadedFiles() files: { before_img?: Express.Multer.File[], after_img?: Express.Multer.File[] },
    @Body() createDto: CreatePhotoTemplateDto
  ) {
    const beforeImg = files.before_img?.[0]?.filename;
    const afterImg = files.after_img?.[0]?.filename;

    return this.service.create(createDto, beforeImg!, afterImg!);
  }
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdatePhotoTemplateDto) {
    return this.service.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Get('/get-photo/:filename')
  getPhoto(@Param('filename') filename: string, @Res({ passthrough: true }) res: Response) {
    const file = this.service.getPhoto(filename);
    const ext = extname(filename).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.set({
      'Content-Type': contentType, // Rasm formatiga qarab dinamik qilish ham mumkin
      'Content-Disposition': 'inline', // 'attachment' emas, 'inline' bo'lishi kerak
    });

    return new StreamableFile(file);
  }
}