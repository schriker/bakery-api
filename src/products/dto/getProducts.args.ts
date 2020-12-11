import {
  ArgsType,
  Field,
  InputType,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { IsPositive, Max, IsInt, Min, IsOptional } from 'class-validator';

export enum OrderEnum {
  'ASC',
  'DESC',
}

registerEnumType(OrderEnum, {
  name: 'OrderEnum',
});

@InputType()
class ProductsOrderType {
  @Field(() => OrderEnum, { nullable: true })
  createdAt?: OrderEnum;

  @Field(() => OrderEnum, { nullable: true })
  price?: OrderEnum;
}

@InputType()
class ProductsFilterType {
  @Field(() => Int, { nullable: true })
  city?: number;

  @Field(() => Int, { nullable: true })
  user?: number;
}

@ArgsType()
export class GetProductsArgs {
  @Field()
  @IsInt()
  @IsPositive()
  @Max(50)
  @Min(5)
  limit: number;

  @Field({ defaultValue: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  currentPage: number;

  @Field(() => ProductsFilterType, {
    nullable: true,
  })
  filter?: ProductsFilterType;

  @Field(() => ProductsOrderType, { nullable: true })
  order?: ProductsOrderType;
}
