import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateShoppingListDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsUUID()
  userID?: string;

  @IsOptional()
  @IsInt()
  groupID?: number;
}