import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { Field, ArgsType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';

@ArgsType()
export class CreateUserArgs {
  @Field()
  @IsEmail()
  @MaxLength(200)
  email: string;

  @Field()
  @MinLength(6)
  @MaxLength(200)
  password: string;

  @Field()
  @MinLength(2)
  @MaxLength(200)
  @Transform((value: string) => value?.trim())
  firstName: string;
}
