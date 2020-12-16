import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductIngredient } from 'src/product-ingredients/entities/product-ingredient.entity';

@Entity('ingredient')
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
  @ManyToOne(() => User, (user) => user.ingredients, { onDelete: 'CASCADE' })
  user: User;

  @Field(() => [ProductIngredient], { nullable: true })
  @OneToMany(
    () => ProductIngredient,
    (productIngredient) => productIngredient.ingredient,
    {
      nullable: true,
    },
  )
  productIngredients: ProductIngredient[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
