import { ArgsType, Field } from '@nestjs/graphql';
import { IsNumber, IsPositive, Max, MinLength } from 'class-validator';

@ArgsType()
export class CreateIngredientArgs {
  @Field()
  @MinLength(3)
  name: string;

  @Field()
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Max(999999.99)
  price: number;

  @Field()
  unit: string;
}
