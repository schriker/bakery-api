import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity('productIngredient')
export class ProductIngredient {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Int)
  @Column()
  count: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.productIngredients)
  user: User;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.productIngredients)
  product: Product;

  @Field(() => Ingredient)
  @ManyToOne(() => Ingredient, (ingredient) => ingredient.productIngredients)
  ingredient: Ingredient;
}
