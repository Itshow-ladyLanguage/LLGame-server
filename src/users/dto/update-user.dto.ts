import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  profile_image: string;

  @IsNumber()
  @IsOptional()
  score: number;
}
