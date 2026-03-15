import { IsString } from "class-validator";

export class RegisterDto {
    @IsString()
    telegram_id: number;

    @IsString()
    phone_number: string;

    @IsString()
    username: string;

    @IsString()
    fullname: string;
}
