import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CreateIngredientArgs } from './dto/createIngredient.args';
import { Ingredient } from './entities/ingredient.entity';
import { IngredientsService } from './ingredients.service';

@Resolver()
export class IngredientsResolver {
  constructor(private ingredeintsService: IngredientsService) {}
  // Later Find By User ID
  @Query(() => [Ingredient])
  ingredients() {
    return this.ingredeintsService.findIngredients();
  }

  @Mutation(() => Ingredient)
  createIngredient(@Args() args: CreateIngredientArgs) {
    return this.ingredeintsService.createIngredient(args);
  }
}
