import { IsOptional, IsString } from "class-validator";

export class RegisterDto {
    @IsString()
    telegram_id: number;

    @IsOptional()
    @IsString()
    phone_number: string;

    @IsString()
    username: string;

    @IsString()
    fullname: string;
}
