import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  telegram_id: number;

  @IsString()
  fullname: string;

  @IsOptional()
  @IsString()
  phone_number: string;

  @IsString()
  username: string;
}