import { ArgsType, Field } from '@nestjs/graphql';
import { IsInt, IsPositive, Max } from 'class-validator';

@ArgsType()
export class CreateProductIngredientArgs {
  @Field()
  @IsInt()
  @IsPositive()
  @Max(99999)
  count: number;

  @Field()
  @IsInt()
  @IsPositive()
  product: number;

  @Field()
  @IsInt()
  @IsPositive()
  ingredient: number;
}
