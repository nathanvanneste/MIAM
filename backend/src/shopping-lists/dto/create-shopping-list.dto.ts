import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateShoppingListDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsInt()
  userID?: number;

  @IsOptional()
  @IsInt()
  groupID?: number;
}