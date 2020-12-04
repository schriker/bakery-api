import { IsEmail, MinLength } from 'class-validator';
import { Field, ArgsType, ObjectType } from '@nestjs/graphql';

@ObjectType()
@ArgsType()
export class ValidateUserArgs {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(6)
  password: string;
}
