import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class GeneratePhoto {
    @IsString()
    @IsNotEmpty()
    text: string;
}