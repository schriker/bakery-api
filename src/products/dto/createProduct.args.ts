import { ArgsType, Field } from '@nestjs/graphql';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsPositive,
  Max,
  MinLength,
} from 'class-validator';

@ArgsType()
export class CreateProductArgs {
  @Field()
  @MinLength(3)
  name: string;

  @Field()
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Max(999999.99)
  price: number;

  @Field()
  @IsInt()
  @IsPositive()
  @Max(999)
  count: number;

  @Field({ defaultValue: false })
  @IsBoolean()
  isPublished: boolean;

  @Field({ defaultValue: false })
  @IsBoolean()
  delivery: boolean;

  @Field({ defaultValue: false })
  @IsBoolean()
  shipping: boolean;

  @Field({ defaultValue: false })
  @IsBoolean()
  pickup: boolean;
}
