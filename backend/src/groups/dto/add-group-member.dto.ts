import { IsInt } from 'class-validator';

export class AddGroupMemberDto {
  @IsInt()
  userID!: number;
}