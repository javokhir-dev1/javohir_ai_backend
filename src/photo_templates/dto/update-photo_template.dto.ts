import { PartialType } from '@nestjs/mapped-types';
import { CreatePhotoTemplateDto } from './create-photo_template.dto';

export class UpdatePhotoTemplateDto extends PartialType(CreatePhotoTemplateDto) {}