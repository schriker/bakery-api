import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Ingredient {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column('decimal', { precision: 8, scale: 2 })
  price: number;

  @Field()
  @Column()
  unit: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.ingredients)
  user: User;
}
