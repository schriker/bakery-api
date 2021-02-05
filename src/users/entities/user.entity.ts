import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Ingredient } from '../../ingredients/entities/ingredient.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { ProductIngredient } from 'src/product-ingredients/entities/product-ingredient.entity';
import { City } from 'src/cities/entities/city.entity';
import { Photo } from 'src/photos/entities/photo.entity';
import { Message } from 'src/messages/entities/message.entity';
import { Conversation } from 'src/messages/entities/conversation.entity';

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

  @Field()
  @Column()
  firstName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone: string;

  @Field({ defaultValue: false })
  @Column({ default: false })
  isVerified: boolean;

  @Column()
  verificationToken: string;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Field({ defaultValue: false })
  @Column({ default: false })
  isSeller: boolean;

  @OneToMany(() => Ingredient, (ingredeint) => ingredeint.user, {
    nullable: true,
  })
  ingredients: Ingredient[];

  @OneToMany(() => Product, (product) => product.user, {
    nullable: true,
  })
  products: Product[];

  @OneToMany(
    () => ProductIngredient,
    (productIngredient) => productIngredient.user,
    {
      nullable: true,
    },
  )
  productIngredients: ProductIngredient[];

  @Field(() => City, { nullable: true })
  @ManyToOne(() => City, (city) => city.users, {
    nullable: true,
  })
  city: City;

  @OneToMany(() => Photo, (photo) => photo.user, {
    nullable: true,
  })
  photos: ProductIngredient[];

  @OneToMany(() => Message, (message) => message.user, {
    nullable: true,
  })
  messages: Message[];

  @ManyToMany(() => Conversation, (conversation) => conversation.participants, {
    nullable: true,
  })
  conversations: Conversation[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
