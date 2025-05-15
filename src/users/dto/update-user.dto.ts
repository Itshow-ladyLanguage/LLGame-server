import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsNumber()
  @IsOptional()
  score: number;
}
