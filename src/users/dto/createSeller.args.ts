import { IsEmail, IsInt, IsPositive, MinLength } from 'class-validator';
import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class CreateSellerArgs {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(6)
  password: string;

  @Field()
  @MinLength(2)
  firstName: string;

  @Field()
  @MinLength(2)
  lastName: string;

  @Field()
  @IsInt()
  @IsPositive()
  city: number;
}
