import { MaxLength } from 'class-validator';
import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class MessageArgs {
  @Field()
  @MaxLength(500)
  text: string;
}
