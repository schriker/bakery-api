import {
  IsEmail,
  IsInt,
  IsPositive,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Field, ArgsType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';

@ArgsType()
export class CreateSellerArgs {
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

  @Field()
  @MinLength(2)
  @MaxLength(200)
  @Transform((value: string) => value?.trim())
  lastName: string;

  @Field()
  @Matches(
    /^(?:(?:(?:\+|00)?48)|(?:\(\+?48\)))?(?:1[2-8]|2[2-69]|3[2-49]|4[1-68]|5[0-9]|6[0-35-9]|[7-8][1-9]|9[145])\d{7}$/,
  )
  phone: string;

  @Field()
  @IsInt()
  @IsPositive()
  city: number;
}
