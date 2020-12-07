import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Ingredient } from '../../ingredients/entities/ingredient.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Field()
  @Column()
  email: string;

  @Column()
  password: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lastName?: string;

  @Field({ defaultValue: false })
  @Column({ default: false })
  isSeller: boolean;

  @Field(() => [Ingredient], { nullable: true })
  @OneToMany(() => Ingredient, (ingredeint) => ingredeint.user, {
    nullable: true,
  })
  ingredients: Ingredient[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
