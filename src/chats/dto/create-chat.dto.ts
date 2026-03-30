import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateChatDto {
  @IsNumber()
  @IsNotEmpty()
  readonly user_id: number;

  @IsString({ message: 'Chat title must be a string' })
  @IsOptional()
  readonly chat_title?: string;
}