import { IsString, IsNumber, IsNotEmpty, IsIn } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsIn(['user', 'model'])
  role: string;
  
  @IsNumber()
  @IsNotEmpty()
  chat_id: number; 

  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}