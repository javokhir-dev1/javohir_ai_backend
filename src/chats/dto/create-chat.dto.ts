import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateChatDto {
  @IsString({ message: 'User ID must be a string' })
  @IsNotEmpty({ message: 'User ID cannot be empty' })
  readonly user_id: string;

  @IsString({ message: 'Chat title must be a string' })
  @IsOptional()
  readonly chat_title?: string;
}