export class CreateRecipeDto {
  name!: string;
  creatorID!: number;

  description?: string;
  price?: number;
  nutritionalScore?: number;
  prepTime?: number;
  cookTime?: number;
  photo?: string;
  portion?: number;
}