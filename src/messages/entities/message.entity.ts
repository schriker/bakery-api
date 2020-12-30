import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Conversation } from './conversation.entity';

@Entity('message')
@ObjectType()
export class Message {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Column()
  text: string;

  @Field({ defaultValue: false })
  @Column({ default: false })
  readed: boolean;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.messages)
  user: User;

  @Field(() => Conversation)
  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  conversation: Conversation;
}
