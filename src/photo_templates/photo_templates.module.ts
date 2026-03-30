import { Module } from '@nestjs/common';
import { PhotoTemplatesService } from './photo_templates.service';
import { PhotoTemplatesController } from './photo_templates.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { PhotoTemplate } from './models/photo_template.model';

@Module({
  imports: [SequelizeModule.forFeature([PhotoTemplate])],
  controllers: [PhotoTemplatesController],
  providers: [PhotoTemplatesService],
})
export class PhotoTemplatesModule {}
