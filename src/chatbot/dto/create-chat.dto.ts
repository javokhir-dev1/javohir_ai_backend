import { IsString, IsNotEmpty, IsIn, IsOptional, IsNumber } from 'class-validator';

export class CreateChatWithAIDTO {
    @IsString()
    @IsNotEmpty()
    text: string;

    @IsNumber()
    @IsNotEmpty()
    user_id: number;
}