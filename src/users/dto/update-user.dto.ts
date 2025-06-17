import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsNumber()
  @IsOptional()
  score?: number;

  @IsString()
  @IsOptional()
  profile_image?: string;

  @IsString()
  @IsOptional()
  type?: string;
}
