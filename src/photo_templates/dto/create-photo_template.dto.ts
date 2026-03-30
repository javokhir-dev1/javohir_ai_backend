import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreatePhotoTemplateDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  subtitle?: string;
}