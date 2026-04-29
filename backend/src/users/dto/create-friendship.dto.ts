import { IsInt } from 'class-validator';

export class CreateFriendshipDto {
  @IsInt()
  requesterID!: number;

  @IsInt()
  receiverID!: number;
}