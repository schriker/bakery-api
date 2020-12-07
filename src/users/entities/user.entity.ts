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
import { Product } from 'src/products/entities/product.entity';
import { ProductIngredient } from 'src/product-ingredients/entities/product-ingredient.entity';

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

  @Field(() => [Product], { nullable: true })
  @OneToMany(() => Product, (product) => product.user, {
    nullable: true,
  })
  products: Product[];

  @Field(() => [ProductIngredient], { nullable: true })
  @OneToMany(
    () => ProductIngredient,
    (productIngredient) => productIngredient.user,
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
