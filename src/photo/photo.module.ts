import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { Photo } from './models/photo.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([Photo]) ],
  controllers: [PhotoController],
  providers: [PhotoService],
})

export class PhotoModule {}