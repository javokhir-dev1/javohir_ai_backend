import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export type AiModelType = 'flash' | 'pro';

export class SendMessageText {
    @IsString()
    @IsNotEmpty()
    text: string;

    @IsIn(['flash', 'pro'])
    model: AiModelType = "flash"

    @IsNotEmpty()
    chat_id: number

    @IsNotEmpty() 
    user_id: number
}