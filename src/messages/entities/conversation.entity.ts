import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('conversation')
@ObjectType()
export class Conversation {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [Message])
  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.conversations)
  @JoinTable()
  participants: User[];
}
