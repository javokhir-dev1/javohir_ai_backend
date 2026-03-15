import {IsString} from "class-validator"

export class LoginDto {
    @IsString()
    telegram_id: number;
}
 