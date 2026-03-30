import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;
}