import { Module } from '@nestjs/common';
import { RecipesModule } from './recipes/recipes.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { ShoppingListsModule } from './shopping-lists/shopping-lists.module';
import { GroupModule } from './group/group.module';
import { UsersModule } from './users/users.module';


@Module({
  imports: [RecipesModule, IngredientsModule, ShoppingListsModule, GroupModule, UsersModule],
})
export class AppModule { }
