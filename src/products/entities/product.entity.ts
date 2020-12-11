import { Field, Int, ObjectType } from '@nestjs/graphql';
import { City } from 'src/cities/entities/city.entity';
import { ProductIngredient } from 'src/product-ingredients/entities/product-ingredient.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('product')
@ObjectType()
export class Product {
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
  name: string;

  @Field()
  @Column('decimal', { precision: 8, scale: 2 })
  price: number;

  @Field(() => Int)
  @Column()
  count: number;

  @Field({ defaultValue: false })
  @Column({ default: false })
  isPublished: boolean;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.ingredients)
  user: User;

  @Field(() => City)
  @ManyToOne(() => City, (city) => city.products)
  city: City;

  @Field(() => [ProductIngredient], { nullable: true })
  @OneToMany(
    () => ProductIngredient,
    (productIngredient) => productIngredient.product,
    {
      nullable: true,
    },
  )
  productIngredients: ProductIngredient[];
}
