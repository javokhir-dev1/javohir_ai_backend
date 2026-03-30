import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

@Injectable()
export class VideoService {
  create(createVideoDto: CreateVideoDto) {
    return 'This action adds a new video';
  }
}
