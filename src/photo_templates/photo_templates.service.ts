import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PhotoTemplate } from './models/photo_template.model';
import { CreatePhotoTemplateDto } from './dto/create-photo_template.dto';
import { UpdatePhotoTemplateDto } from './dto/update-photo_template.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PhotoTemplatesService {
  constructor(
    @InjectModel(PhotoTemplate) private readonly photoTemplateModel: typeof PhotoTemplate
  ) { }

  async create(createDto: CreatePhotoTemplateDto, beforeImg: string, afterImg: string) {
    return await this.photoTemplateModel.create({
      ...createDto,
      before_img: beforeImg,
      after_img: afterImg,
    });
  }

  async findAll() {
    return await this.photoTemplateModel.findAll();
  }

  async findOne(id: number) {
    const template = await this.photoTemplateModel.findByPk(id);
    if (!template) throw new NotFoundException('Template topilmadi');
    return template;
  }

  async update(id: number, updateDto: UpdatePhotoTemplateDto) {
    const template = await this.findOne(id);
    return await template.update(updateDto);
  }

  async remove(id: number) {
    const template = await this.findOne(id);

    [template.before_img, template.after_img].forEach(filePath => {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); 
      }
    });

    await template.destroy();
    return { message: "Muvaffaqiyatli o'chirildi" };
  }

  getPhoto(filename: string) {
    const filePath = path.join(process.cwd(), 'uploads/photo-templates', filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Rasm topilmadi');
    }

    return fs.createReadStream(filePath);
  }
}