import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  memberIDs?: number[];
}